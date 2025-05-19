'use client';

import { FiCalendar, FiClock } from 'react-icons/fi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

interface DateHeureStepProps {
  date: string;
  setDate: (date: string) => void;
  heureDebut: dayjs.Dayjs | null;
  setHeureDebut: (heure: dayjs.Dayjs | null) => void;
  duree: string;
  setDuree: (duree: string) => void;
}

export default function DateHeureStep({
  date,
  setDate,
  heureDebut,
  setHeureDebut,
  duree,
  setDuree
}: DateHeureStepProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">
        <FiCalendar className="w-5 h-5" />
        <h3 className="font-medium">Date et heure</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            type="date" 
            className="w-full p-2 border border-gray-300 rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <TimePicker
                value={heureDebut}
                onChange={(newValue) => setHeureDebut(newValue)}
                minTime={dayjs().hour(7).minute(0)}
                maxTime={dayjs().hour(20).minute(0)}
                ampm={false}
                skipDisabled={true}
                minutesStep={5}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    size: 'small',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: '42px',
                        borderRadius: '0.375rem',
                        backgroundColor: 'white',
                        border: '1px solid #D1D5DB',
                        '&:hover': {
                          borderColor: '#9CA3AF'
                        },
                        '& fieldset': {
                          border: 'none'
                        }
                      },
                      '& .MuiInputBase-input': {
                        padding: '0.5rem 0.75rem',
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 heure</option>
            <option value="90">1 heure 30</option>
            <option value="120">2 heures</option>
          </select>
        </div>
      </div>
    </div>
  );
}
