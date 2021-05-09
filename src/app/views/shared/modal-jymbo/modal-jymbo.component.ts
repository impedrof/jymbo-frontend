import {Component, Injectable, Input, OnInit, Output, TemplateRef, EventEmitter} from '@angular/core';
import {ModalConfig} from './modal-config';

@Component({
  selector: 'jyModal',
  templateUrl: './modal-jymbo.component.html',
  styleUrls: ['./modal-jymbo.component.css']
})
@Injectable()
export class ModalJymboComponent implements OnInit {

  @Input() public modalConfig: ModalConfig;

  @Input() bodyModal: TemplateRef<any>;

  @Output() eventClose = new EventEmitter<any>();

  public isOpen: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.eventClose.emit();
  }

}
