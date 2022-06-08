import { WeekDays, SolveLec, WEEK_DAYS, START_TIMES, STEP_TIME } from './index';
interface row {
   day: WeekDays;
   tds: (SolveLec | null|'todoDelete')[];
}


export const table: { rows: row[], lecs: SolveLec[]; } = {
   rows: [],

   set lecs(ls: SolveLec[]) {
      this.rows = [];
      for (let w of WEEK_DAYS)//add empty rows and its <td>s
         this.rows.push({ day: w, tds: Array(START_TIMES.length).fill(null) });
      for (let l of ls)//bind lectures with type SolveLec[] to row[]
         for (let r of this.rows)
            if (l.day == r.day) {
               r.tds[START_TIMES.indexOf(l.startTime)] = l;
               //delete empty td to make lecture longer then STEP_TIME take more than one column i.e long width
               for (let i = l.startTime + STEP_TIME; i < l.startTime + l.duration; i += STEP_TIME)
                  r.tds[START_TIMES.indexOf(i)] = 'todoDelete';
            }
      for (let r of this.rows)
         r.tds = r.tds.filter((v) => v != 'todoDelete')
      }
}