import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Journal} from './journal';
import {JournalListComponent} from './journal-list.component';
import {JournalListService} from './journal-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Journal list', () => {

    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.of([
                {
                    _id: 'tues_id',
                    subject: 'Tuesday',
                    body: "tuesday body",
                    date: ""
                },
                {
                    _id: 'wed_id',
                    subject: 'Wednesday',
                    body: "wednesday body",
                    date: ""
                },
                {
                    _id: 'thurs_id',
                    subject: 'Thursday',
                    body: "it was cold",
                    date: ""
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [JournalListComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: JournalListService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the journals', () => {
        expect(journalList.journals.length).toBe(3);
    });

    it('contains a journal on \'Wednesday\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Wednesday')).toBe(true);
    });

    it('contain a body with \'cold\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.body === 'it was cold')).toBe(true);
    });

    it('doesn\'t contain a subject of \'Sunday\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Sunday')).toBe(false);
    });

});

describe('Misbehaving User List', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [{provide: JournalListService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalListService', () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(journalList.journals).toBeUndefined();
    });
});


describe('Adding a journal', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;
    const newJournal: Journal = {
        _id: '',
        subject: "Sunday",
        body: "today was hot",
        date: ""
    };
    const newId = 'sun_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        addNewJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddJournalComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalService for test purposes
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            addNewJournal: (journalToAdd: Journal) => {
                calledJournal = journalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [
                {provide: JournalListService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalListService.addJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openDialog();
        expect(calledJournal).toEqual(newJournal);
    });
});
