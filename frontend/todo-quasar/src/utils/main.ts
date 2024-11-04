import { date } from 'quasar';

type noticeMessage = {
  color: string;
  textColor: string;
  icon: string;
  message: string;
};

export function nowDateOrTime(value: 'time' | 'date'): string | undefined {
  const timeStamp = Date.now();
  if (value === 'time') {
    return date.formatDate(timeStamp, 'HH:mm');
  } else if (value === 'date') {
    return date.formatDate(timeStamp, 'YYYY-MM-DD');
  }
}

export function errorMessage(message: string): noticeMessage {
  return {
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message: message,
  };
}

export function successMessage(message: string): noticeMessage {
  return {
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: message,
  };
}
