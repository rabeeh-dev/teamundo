export function validateOnboardingStep(step, form) {
  switch (step) {
    case 1:
      if (!form.name.trim()) return 'Please enter your name';
      if (form.name.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    case 2:
      if (!form.district) return 'Please select your district';
      return null;
    case 3:
      if (form.age < 16 || form.age > 80) return 'Age must be between 16 and 80';
      return null;
    case 4:
      if (!form.profession) return 'Please select a profession';
      return null;
    case 5:
      if (form.phone && form.phone.length !== 10) return 'Phone number must be 10 digits';
      return null;
    case 6:
      if (!form.instagram.trim()) return 'Instagram username is required';
      return null;
    default:
      return null;
  }
}
