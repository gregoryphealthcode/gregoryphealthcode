import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from '../../base/subscribtion.base';
import { SpecialistViewModel } from '../../models/SpecialistViewModel';
import { EpisodeTypes, UserService } from '../../services/user.service';
import { SitesStore } from '../../stores/sites.store';
import { InvoiceServicesStoreService, ServiceParentEntityType, } from './invoice-services-store.service';

@Component({
  selector: 'app-invoice-services-select',
  templateUrl: './invoice-services-select.component.html',
  styleUrls: ['./invoice-services-select.component.scss']
})
export class InvoiceServicesSelectComponent extends SubscriptionBase implements OnInit {
  @Input() appointmentId: string;

  @Output() serviceAdded = new EventEmitter();

  owners: SpecialistViewModel[];
  episodeTypes: EpisodeTypes[] = [];
  editMode: any;
  
  constructor(
    private userService: UserService,
    private siteStore: SitesStore,
    public store: InvoiceServicesStoreService
  ) {
    super()
  }

  ngOnInit() {
    this.addToSubscription(this.userService.getConsultantsForSite().pipe(tap((x) => this.owners = x)));
    this.addToSubscription(this.userService.getEpisodeTypes().pipe(tap((x) => this.episodeTypes = x)));
    this.addToSubscription(this.store.currentService$.pipe(tap(x => this.editMode = !!x)))
    if (this.appointmentId) {
      this.store.setParentEntityType(ServiceParentEntityType.Appointment);
      this.store.setParentEntityId(this.appointmentId);
    }
  }

  addNewService() {
    this.store.showAddNewService();
  }

  serviceAddedHandler() {
    this.serviceAdded.emit();
  }
}
