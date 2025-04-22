import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import styles from './EditUserForm.module.css';
import { updateUser } from '../../services/usersService';

interface EditUserFormProps {
    user: User;
    onUserUpdated: (updatedUser: User) => void;
    onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUserUpdated, onCancel }) => {
    const [formData, setFormData] = useState<User>({
        name: '',
        age: 0,
        email: '',
        password: '',
        phone: 0
    });

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' || name === 'phone' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formData.name || !formData.age || !formData.email) {
            alert('Please fill out all required fields.');
            return;
        }

        try {
            if (user._id) {
                await updateUser(user._id, formData);
                onUserUpdated(formData);
            } else {
                alert('Cannot update user without ID');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Edit User</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="age" className={styles.label}>Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        min="0"
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter new password or leave unchanged"
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>Phone (optional)</label>
                    <input
                        type="number"
                        id="phone"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                
                <div className={styles.buttonGroup}>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className={`${styles.button} ${styles.cancelButton}`}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className={styles.button}
                    >
                        Update User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserForm;