import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Tracker} from './tracker';
import {TrackerListComponent} from './tracker-list.component';
import {TrackerListService} from './tracker-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Tracker list', () => {

    let trackerList: TrackerListComponent;
    let fixture: ComponentFixture<TrackerListComponent>;

    let trackerListServiceStub: {
        getTrackers: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub TrackerService for test purposes
        trackerListServiceStub = {
            getTrackers: () => Observable.of([
                {
                    _id: 'happy_id',
                    emoji: 'happy',
                    date: ""
                },
                {
                    _id: 'sad_id',
                    emoji: 'sad',
                    date: ""
                },
                {
                    _id: 'neutral_id',
                    emoji: 'neutral',
                    date: ""
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TrackerListComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TrackerListService, useValue: trackerListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TrackerListComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the trackers', () => {
        expect(trackerList.trackers.length).toBe(3);
    });

    it('contains a \'happy\' tracker', () => {
        expect(trackerList.trackers.some((tracker: Tracker) => tracker.emoji === 'happy')).toBe(true);
    });

    it('contains a \'neutral\' tracker', () => {
        expect(trackerList.trackers.some((tracker: Tracker) => tracker.emoji === 'neutral')).toBe(true);
    });

    it('contains a \'sad\' tracker', () => {
        expect(trackerList.trackers.some((tracker: Tracker) => tracker.emoji === 'sad')).toBe(true);
    });

});

describe('Misbehaving Tracker List', () => {
    let trackerList: TrackerListComponent;
    let fixture: ComponentFixture<TrackerListComponent>;

    let trackerListServiceStub: {
        getTrackers: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub TrackerService for test purposes
        trackerListServiceStub = {
            getTrackers: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TrackerListComponent],
            providers: [{provide: TrackerListService, useValue: trackerListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TrackerListComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a TrackerListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(trackerList.trackers).toBeUndefined();
    });
});


describe('Adding a tracker', () => {
    let trackerList: TrackerListComponent;
    let fixture: ComponentFixture<TrackerListComponent>;
    const newTracker: Tracker = {
        _id: '',
        emoji: 'sad',
        date: ""
    };
    const newId = 'sad_id';

    let calledTracker: Tracker;

    let trackerListServiceStub: {
        getTrackers: () => Observable<Tracker[]>,
        addNewTracker: (newTracker: Tracker) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddTrackerComponent, any) => {
            afterClosed: () => Observable<Tracker>
        };
    };

    beforeEach(() => {
        calledTracker= null;
        // stub TrackerService for test purposes
        trackerListServiceStub = {
            getTrackers: () => Observable.of([]),
            addNewTracker: (trackerToAdd: Tracker) => {
                calledTracker = trackerToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newTracker);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TrackerListComponent],
            providers: [
                {provide: TrackerListService, useValue: trackerListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TrackerListComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    /**
    it('calls TrackerListService.addTracker', () => {
        expect(calledTracker).toBeNull();
        trackerList.addEmoji("happy");
        expect(calledTracker).toEqual(newTracker);
    });
     **/
});
