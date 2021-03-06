import { Component, OnInit, Input } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { HivSummaryService } from './hiv-summary.service';
import { PatientService } from '../../services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';
const mdtProgramUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';
@Component({
  selector: 'app-hiv-summary',
  templateUrl: './hiv-summary.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryComponent implements OnInit {
  viremiaAlert: string;
  showViremiaAlert: boolean;
  lowViremia: boolean;
  highViremia: boolean;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
              private hivSummaryService: HivSummaryService,
              private patientService: PatientService,
              private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Hiv Summary Loaded', 'ngOnInit');
    this.loadHivSummary();
    this.route.url.subscribe(url => {
      if (url[1]) {
        if (url[1].path === mdtProgramUuid) {
          this.showViremiaAlert = true;
        }
      }
    });
  }

  public loadHivSummary() {

    this.patientService.currentlyLoadedPatientUuid
    .flatMap(patientUuid => this.hivSummaryService.getHivSummary(patientUuid, 0, 1, false))
    .subscribe((data) => {
        if (data) {
          for (const summary of data) {
            if (summary.is_clinical_encounter === 1 && this.showViremiaAlert) {
              this.checkViremia(summary.vl_1);
              break;
          }
         }
        }
      });
  }

  public checkViremia(viralLoad) {
    let alert;
    if (viralLoad > 1 && viralLoad <= 999) {
           this.lowViremia = true;
           alert = 'Low Viremia';
    } else if (viralLoad >= 1000) {
           this.highViremia = true;
           alert = 'High Viremia';
    }
    if (alert) {
      this.viremiaAlert = alert;
    }
  }


}
