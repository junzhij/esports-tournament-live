import React from 'react';

interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, hint, children }) => {
  return (
    <div className="form-field">
      <label>{label}</label>
      {children}
      {hint ? <span className="small">{hint}</span> : null}
    </div>
  );
};

export default FormField;
