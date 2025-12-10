import { type FormData } from '../types/types'
import BasicInfoFields from './formFields/BasicInfoFields';
import PricingFields from './formFields/PricingFields';
import CategoryField from './formFields/CategoyFields';

interface FormSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

const FormSection = ({ formData, setFormData }: FormSectionProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <BasicInfoFields formData={formData} onChange={handleInputChange} />
      <PricingFields formData={formData} onChange={handleInputChange} />
      <CategoryField formData={formData} onChange={handleInputChange} />
    </>
  );
};

export default FormSection;