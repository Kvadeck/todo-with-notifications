import { date } from 'quasar';
import { Notify } from 'quasar';

export function nowDateOrTime(value: 'time' | 'date'): string | undefined {
  const timeStamp = Date.now();
  if (value === 'time') {
    return date.formatDate(timeStamp, 'HH:mm');
  } else if (value === 'date') {
    return date.formatDate(timeStamp, 'YYYY-MM-DD');
  }
}

export function errorMessage(message: string) {
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    position: 'top',
    message: message,
    progress: true,
  });
}

export function successMessage(message: string) {
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    position: 'top',
    message: message,
    progress: true,
  });
}
