import { TestBed } from '@angular/core/testing';

import { GenerateTableService } from './generate-table.service';
import { Final, SolveLec, StaticLec } from '@service/static'
describe('GenerateTableService', () => {
  let s: GenerateTableService;
  let staticLecs: StaticLec[]
  let solveLecs: SolveLec[];
  const final: Final = new Final();
  beforeEach(() => {
    TestBed.configureTestingModule({});
    s = TestBed.inject(GenerateTableService);
    staticLecs = [
      { name: 'English', teacher: 'Abduallah', weekDuration: 3.5, room: '301' },
      { name: 'Server-Side', teacher: 'Hassan', weekDuration: 6, room: '302' },
      { name: 'PM', teacher: 'Hamza', weekDuration: 3, room: '401' },
      { name: 'HCI', teacher: 'Ahmed', weekDuration: 6, room: '402' },
      { name: 'Database', teacher: 'Mohammed', weekDuration: 6, room: 'Lab 3' },
      { name: 'Organization', teacher: 'Mohsen', weekDuration: 3, room: 'Lab 4' },
    ];
    solveLecs = [
      { lecture: staticLecs[0], day: 'Saturday', startTime: 8, duration: 2 }
    ]
  });

  it('should be created', () => {
    expect(s).toBeTruthy();
  });
  it('needTouch', () => {
    expect(s.needTouch(staticLecs[0], solveLecs)).toBeTrue();
    solveLecs.push({ lecture: staticLecs[0], day: 'Monday', startTime: 12, duration: 1.5 });
    expect(s.needTouch(staticLecs[0], solveLecs)).toBeFalse();//weekDuration is fulfilled
    expect(s.needTouch(staticLecs[1], solveLecs)).toBeTrue();
    solveLecs.push({ lecture: staticLecs[1], day: 'Monday', startTime: 12, duration: 3 });
    expect(s.needTouch(staticLecs[1], solveLecs)).toBeTrue();
    solveLecs.push({ lecture: staticLecs[1], day: 'Monday', startTime: 12, duration: 3 });
    expect(s.needTouch(staticLecs[1], solveLecs)).toBeFalse();
    expect(s.needTouch(staticLecs[2], solveLecs)).toBeTrue();
  });
  
  it('totalHours', () => {
    expect(s.getTotalHours(solveLecs, staticLecs[1])).toBe(0);
    solveLecs.push({ lecture: staticLecs[1], day: 'Monday', startTime: 9, duration: 3 });
    expect(s.getTotalHours(solveLecs, staticLecs[1])).toBe(3);
    solveLecs.push({ lecture: staticLecs[1], day: 'Tuesday', startTime: 8, duration: 2 });
    expect(s.getTotalHours(solveLecs, staticLecs[1])).toBe(5);
    solveLecs.push({ lecture: staticLecs[1], day: 'Tuesday', startTime: 11, duration: 2 });
    expect(s.getTotalHours(solveLecs, staticLecs[1])).toBe(7);
  });

  it('isPossible', () => {
    expect(s.isPossible(solveLecs, { lecture: staticLecs[2], day: 'Monday', startTime: 8, duration: 2.5 })).toBeTrue();
    solveLecs.push({ lecture: staticLecs[2], day: 'Tuesday', startTime: 8, duration: 3 });
    expect(s.isPossible(solveLecs, { lecture: staticLecs[2], day: 'Tuesday', startTime: 11, duration: 2.5 })).toBeFalse();//over week Duration

    expect(s.isPossible(solveLecs, { lecture: staticLecs[1], day: 'Wednesday', startTime: 8.5, duration: 1.5 })).toBeTrue();
    solveLecs.push({ lecture: staticLecs[1], day: 'Wednesday', startTime: 8, duration: 1 });
    expect(s.isPossible(solveLecs, { lecture: staticLecs[1], day: 'Wednesday', startTime: 9, duration: 2 })).toBeTrue();
    solveLecs.push({ lecture: staticLecs[1], day: 'Wednesday', startTime: 9, duration: 2 });
    expect(s.isPossible(solveLecs, { lecture: staticLecs[1], day: 'Wednesday', startTime: 10, duration: 2 })).toBeFalse();//startTime=9,dur=2 then this is startTime=10!
    solveLecs.push({ lecture: staticLecs[4], day: 'Thursday', startTime: 10, duration: 2 });
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: 9, duration: 1 })).toBeTrue();
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: 8, duration: 3 })).toBeFalse();//exist lec at start=10,dur=2 
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: 12, duration: 1 })).toBeTrue();
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: 11, duration: 2 })).toBeFalse();//exist lec at start=10,dur=2

    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: final.START_TIME, duration: 1 })).toBeTrue();
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: final.START_TIME - 1, duration: 2 })).toBeFalse();//start before available first start time

    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: final.LAST_START_TIME, duration: 2 })).toBeFalse();//exceeds day available period:  __|_ where (_) is lec dur and (|) is table border
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: final.LAST_START_TIME - final.STEP_TIME, duration: final.MIN_LECTURE_DURATION })).toBeTrue();//last available period: __|
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: final.LAST_START_TIME - final.STEP_TIME, duration: final.MAX_LECTURE_DURATION })).toBeFalse();//exceeds available period 'cause of long dur: ___|_
    expect(s.isPossible(solveLecs, { lecture: staticLecs[4], day: 'Thursday', startTime: final.LAST_START_TIME, duration: final.STEP_TIME })).toBeFalse();//exceeds available period 'cause of start time: |__

    expect(s.isPossible(solveLecs, { lecture: staticLecs[3], day: 'Sunday', startTime: final.START_TIME, duration: 2 })).toBeTrue();
    solveLecs.push({ lecture: staticLecs[3], day: 'Sunday', startTime: final.START_TIME, duration: 2 });
    expect(s.isPossible(solveLecs, { lecture: staticLecs[3], day: 'Sunday', startTime: final.START_TIME + 2, duration: 2 })).toBeFalse();//sum two lecture dur at same day more than MAX_DURATION
    expect(s.isPossible(solveLecs, { lecture: staticLecs[3], day: 'Sunday', startTime: final.START_TIME + 2, duration: 1 })).toBeTrue();//sum two lecture dur at same day equal max_duration

  });


});