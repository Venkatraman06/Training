import React, { useState } from 'react';
import styles from './NewTrainingForm.module.css';

interface NewTrainingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewTrainingForm: React.FC<NewTrainingFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="trainingName">Training Name</label>
          <input type="text" id="trainingName" placeholder="e.g. Advanced React Bootcamp" required />
        </div>
      </div>
      
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="college">College / University</label>
          <input type="text" id="college" placeholder="e.g. MIT Pune" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="department">Department</label>
          <input type="text" id="department" placeholder="e.g. Computer Science" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="mode">Training Mode</label>
          <select id="mode" required>
            <option value="offline">Offline / On-Campus</option>
            <option value="online">Online / Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="students">Expected Students</label>
          <input type="number" id="students" placeholder="100" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" required />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="notes">Additional Notes</label>
        <textarea id="notes" rows={3} placeholder="Any specific requirements..."></textarea>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creating...' : 'Create Training'}
        </button>
      </div>
    </form>
  );
};

export default NewTrainingForm;
