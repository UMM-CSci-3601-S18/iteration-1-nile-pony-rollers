import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';

import {TrackerListComponent} from './trackers/tracker-list.component';
import {TrackerListService} from './trackers/tracker-list.service';

import {JournalListComponent} from "./journals/journal-list.component";
import {JournalListService} from "./journals/journal-list.service";
import {AddJournalComponent} from './journals/add-journal.component';

import {ResponseComponent} from './home/response.component';
import {ResponseComponent2} from "./home/response-2.component";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UserListComponent,
        AddUserComponent,
        AddJournalComponent,
        TrackerListComponent,
        JournalListComponent,
        ResponseComponent,
        ResponseComponent2

    ],
    providers: [
        UserListService,
        TrackerListService,
        JournalListService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
        AddUserComponent,
        AddJournalComponent,
        ResponseComponent,
        ResponseComponent2

    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
