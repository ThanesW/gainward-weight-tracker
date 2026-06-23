import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import FoodNameAutocomplete from '../components/foodlog/FoodNameAutocomplete';
import QuantitySelector, { resolveQuantity } from '../components/foodlog/QuantitySelector';
import UnitSelector from '../components/foodlog/UnitSelector';
import DateTimePicker from '../components/foodlog/DateTimePicker';
import RecentFoodsQuickSelect from '../components/foodlog/RecentFoodsQuickSelect';
import PhotoCapture from '../components/foodlog/PhotoCapture';
import { useAppData } from '../context/AppDataContext';
import { combineDateAndTime, toLocalDateInputValue, toLocalTimeInputValue } from '../utils/dateUtils';
import { CUSTOM_QUANTITY_VALUE, OTHER_UNIT_VALUE, QUANTITY_PRESETS, UNIT_OPTIONS } from '../types';
import { parseQuantityValue } from '../utils/formatUtils';

/** Finds the matching preset string for a numeric quantity, or 'Custom' if none matches. */
function matchQuantityPreset(quantity) {
  const match = QUANTITY_PRESETS.find((p) => {
    if (p === CUSTOM_QUANTITY_VALUE) return false;
    return Math.abs(parseQuantityValue(p) - quantity) < 0.001;
  });
  return match || CUSTOM_QUANTITY_VALUE;
}

export default function AddFoodLog() {
  const navigate = useNavigate();
  const { id } = useParams(); // present only when editing
  const isEditing = Boolean(id);

  const {
    addFoodLog,
    updateFoodLog,
    getFoodLogById,
    uniqueFoodNames,
    recentFoods,
    settings,
    uploadFoodPhoto,
  } = useAppData();
  const existing = isEditing ? getFoodLogById(id) : null;

  const now = new Date();
  const existingDate = existing ? new Date(existing.eatDateTime) : now;

  const [foodName, setFoodName] = useState(existing?.foodName || '');
  const [quantityPreset, setQuantityPreset] = useState(() =>
    existing ? matchQuantityPreset(existing.quantity) : '1'
  );
  const [customQuantity, setCustomQuantity] = useState(() => {
    if (!existing) return '';
    return matchQuantityPreset(existing.quantity) === CUSTOM_QUANTITY_VALUE
      ? String(existing.quantity)
      : '';
  });
  const [unit, setUnit] = useState(() => {
    if (!existing) return 'จาน';
    return UNIT_OPTIONS.includes(existing.unit) ? existing.unit : OTHER_UNIT_VALUE;
  });
  const [customUnit, setCustomUnit] = useState(() => {
    if (!existing) return '';
    return UNIT_OPTIONS.includes(existing.unit) ? '' : existing.unit;
  });
  const [isHistorical, setIsHistorical] = useState(isEditing);
  const [dateValue, setDateValue] = useState(toLocalDateInputValue(existingDate));
  const [timeValue, setTimeValue] = useState(toLocalTimeInputValue(existingDate));

  // Photo state: `photoFile` is a newly-picked, not-yet-uploaded File.
  // `keepExistingPhoto` tracks whether an edit should keep or drop the saved photo.
  const [photoFile, setPhotoFile] = useState(null);
  const [keepExistingPhoto, setKeepExistingPhoto] = useState(Boolean(existing?.photoPath));

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const favorites = settings.favoriteFoods || [];

  const eatDateTime = useMemo(() => {
    if (!isHistorical) return new Date().toISOString();
    try {
      return combineDateAndTime(dateValue, timeValue);
    } catch {
      return new Date().toISOString();
    }
  }, [isHistorical, dateValue, timeValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Food name is optional now — a photo can stand in for it. Require at
    // least one of the two so a log always has something identifying it.
    const hasPhoto = Boolean(photoFile) || keepExistingPhoto;
    if (!foodName.trim() && !hasPhoto) {
      setError('Add a food name or a photo so you can tell entries apart later.');
      return;
    }

    const quantity = resolveQuantity(quantityPreset, customQuantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    const finalUnit = unit === OTHER_UNIT_VALUE ? customUnit.trim() : unit;
    if (!finalUnit) {
      setError('Please enter a custom unit name.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      let photoPath = isEditing ? (keepExistingPhoto ? existing.photoPath : null) : null;

      if (photoFile) {
        const uploadedPath = await uploadFoodPhoto(photoFile);
        if (!uploadedPath) {
          setError('Photo upload failed. Check your connection and try again.');
          setIsSaving(false);
          return;
        }
        photoPath = uploadedPath;
      }

      const payload = {
        foodName: foodName.trim() || 'Untitled meal',
        quantity,
        unit: finalUnit,
        eatDateTime,
        photoPath,
      };

      if (isEditing) {
        const updated = await updateFoodLog(id, payload);
        if (!updated) {
          setError('Could not save changes. Check your connection and try again.');
          setIsSaving(false);
          return;
        }
        navigate(`/log/${id}`);
      } else {
        const created = await addFoodLog(payload);
        if (!created) {
          setError('Could not save this log. Check your connection and try again.');
          setIsSaving(false);
          return;
        }
        navigate(`/log/${created.id}`);
      }
    } catch (err) {
      console.error('AddFoodLog: unexpected error saving', err);
      setError('Something went wrong saving this log. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full pb-10">
      <PageHeader title={isEditing ? 'Edit food log' : 'Add food log'} back />

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 pt-5 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-ink dark:text-cream-dark-text mb-2">
            Photo
          </label>
          <PhotoCapture
            file={photoFile}
            existingPhotoUrl={keepExistingPhoto ? existing?.photoUrl : null}
            onFileSelected={setPhotoFile}
            onRemoveExisting={() => setKeepExistingPhoto(false)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink dark:text-cream-dark-text mb-2">
            Food name <span className="font-normal text-ink-soft/70">(optional with a photo)</span>
          </label>
          <FoodNameAutocomplete
            value={foodName}
            onChange={setFoodName}
            suggestions={uniqueFoodNames}
            favorites={favorites}
          />
        </div>

        {!isEditing && (
          <RecentFoodsQuickSelect foods={recentFoods} favorites={favorites} onSelect={setFoodName} />
        )}

        <div>
          <label className="block text-sm font-semibold text-ink dark:text-cream-dark-text mb-2">
            When did you eat this?
          </label>
          <DateTimePicker
            isHistorical={isHistorical}
            dateValue={dateValue}
            timeValue={timeValue}
            onToggleHistorical={setIsHistorical}
            onDateChange={setDateValue}
            onTimeChange={setTimeValue}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink dark:text-cream-dark-text mb-2">
            Quantity
          </label>
          <QuantitySelector
            preset={quantityPreset}
            customValue={customQuantity}
            onPresetChange={setQuantityPreset}
            onCustomValueChange={setCustomQuantity}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink dark:text-cream-dark-text mb-2">
            Unit
          </label>
          <UnitSelector
            unit={unit}
            customUnit={customUnit}
            onUnitChange={setUnit}
            onCustomUnitChange={setCustomUnit}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" full onClick={() => navigate(-1)} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" full disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
