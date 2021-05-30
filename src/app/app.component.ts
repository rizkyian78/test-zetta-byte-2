import { Observable } from 'rxjs';
import { AfterViewInit, ElementRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dataArray from '../assets/data/data.json';
import { uniq } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  private _jsonURL = '../assets/data/data.json';
  public data: any = [];
  public functionCalled: boolean = false;
  public tabsMenu: any = [];
  private modData: any = [];

  constructor(private elementRef: ElementRef, private http: HttpClient) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      'gray';
  }

  ngOnInit() {
    this.getAllShortName();
    this.getData().subscribe((data) => (this.data = data));
    window.addEventListener('keydown', this.disableF5);
  }
  public disableF5(e: any) {
    if ((e.which || e.keyCode) == 116) e.preventDefault();
  }
  public getData(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  private getAllShortName() {
    const filteredData = dataArray.filter((x) => x.certifier);
    const shortNameData: any[] = [];

    for (const item of filteredData) {
      shortNameData.push(item.certifier?.short_name);
    }
    const result = uniq(shortNameData);
    this.tabsMenu = result;
  }
  public filteredCardByTabs(value: any) {
    this.data =
      this.functionCalled && this.modData.includes((x: any) => !x.certifier)
        ? this.modData
            .filter((x: any) => x.certifier)
            .filter((x: any) => x.certifier.short_name === value.tab.textLabel)
        : dataArray
            .filter((x: any) => x.certifier)
            .filter((x: any) => x.certifier.short_name === value.tab.textLabel);
    if (value.tab.textLabel === 'All') {
      this.data = dataArray;
    }
    this.functionCalled = true;
  }
  public searchValue(value: any) {
    const modValue = value.target.value.toUpperCase();
    const result =
      this.functionCalled && this.modData.includes((x: any) => !x.certifier)
        ? this.modData.filter((x: any) => {
            const filteredShortName = x.short_name.replace(/[-,\s]/g, '');
            return filteredShortName.toUpperCase().includes(modValue);
          })
        : dataArray.filter((x) => {
            const filteredShortName = x.short_name.replace(/[-,\s]/g, '');
            return filteredShortName.toUpperCase().includes(modValue);
          });
    this.data = result;
    this.functionCalled = true;
    this.modData = result;
  }

  public clearValue() {
    this.data = dataArray;
  }
}
