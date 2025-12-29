// Walidacja formularzy
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateMessage = (message: string): boolean => {
  return message.trim().length >= 10;
};

export const validateSubject = (subject: string): boolean => {
  return subject.trim().length > 0;
};

// Typy błędów
export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// Funkcja walidacji całego formularza
export const validateContactForm = (formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (!validateName(formData.name)) {
    errors.name = 'Imię i nazwisko musi mieć co najmniej 2 znaki';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Podaj prawidłowy adres email';
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Podaj prawidłowy numer telefonu';
  }

  if (!validateSubject(formData.subject)) {
    errors.subject = 'Wybierz temat wiadomości';
  }

  if (!validateMessage(formData.message)) {
    errors.message = 'Wiadomość musi mieć co najmniej 10 znaków';
  }

  return errors;
};
