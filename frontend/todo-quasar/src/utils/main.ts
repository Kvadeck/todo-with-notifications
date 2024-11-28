import { date } from 'quasar';
import { Notify } from 'quasar';
import { DELETE_MESSAGE_DURATION } from 'src/constants';

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
    icon: 'error',
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

export function deleteMessage(
  message: string,
  action: () => void,
  onEnd: () => void,
) {
  const additionalTime = 1500;
  const timeoutDuration = DELETE_MESSAGE_DURATION + additionalTime;

  const timeoutId = setTimeout(async () => {
    onEnd();
  }, timeoutDuration);

  const handleAction = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    action();
  };

  Notify.create({
    type: 'warning',
    position: 'top',
    icon: 'warning',
    message: message,
    progress: true,
    timeout: DELETE_MESSAGE_DURATION,
    actions: [{ label: 'Recover', color: 'white', handler: handleAction }],
  });
}

export function setLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : defaultValue;
}
