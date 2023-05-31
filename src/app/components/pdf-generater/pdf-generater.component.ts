import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import '../../../assets/fonts/simsun.js';
import * as html2pdf from 'html2pdf.js';
import dataBasic from '../../fake-data/data-only/0-基本資料.json';
import dataSurveyA from '../../fake-data/data-only/1-評估結果報告.json';
import dataSurveyB from '../../fake-data/data-only/2-評估結果與療育建議書.json';
import dataSurveyC from '../../fake-data/data-only/3-診斷分類表.json';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import ClassicEditor from '@haifahrul/ckeditor5-build-rich';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { HttpClient } from '@angular/common/http';
import * as mammoth from '../../../../node_modules/mammoth/mammoth.browser';

@Component({
  selector: 'app-pdf-generater',
  templateUrl: './pdf-generater.component.html',
  styleUrls: ['./pdf-generater.component.scss'],
})
export class PdfGeneraterComponent implements OnInit {
  basicData: any;
  surveyA: any;
  surveyB: any;
  surveyC: any;
  attachmentUrl: any;
  attachmentContent: any;
  tailAttachementUrl: string = '';
  combinedData: Array<any> = [];
  clickEventSubscription: Subscription | undefined;
  editor = ClassicEditor;

  constructor(
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private renderer: Renderer2
  ) {}
  @ViewChild('content', { static: false }) el!: ElementRef;

  ngOnInit(): void {
    this.basicData = dataBasic.data.earlyRecord;
    this.surveyA = dataSurveyA.data.data;
    this.surveyB = dataSurveyB.data.data;
    this.surveyC = dataSurveyC.data.data;
    this.attachmentUrl = this.basicData.attachment;
    this.tailAttachementUrl = this.attachmentUrl
      .split('/')
      [this.attachmentUrl.split('/').length - 1].split('.')[1];
    this.combinedData = this.filterData(
      this.surveyA,
      this.surveyB,
      this.surveyC
    );
  }
  public Editor = ClassicEditor;
  public ckeditorContent: string = '';

  onChange({ editor }: ChangeEvent) {
    let data = editor.data.get();
    data = data.replace(/<figure.*?>(.*?)<\/figure>/gs, '$1');
    data = data.replace(/<h1.*?>(?:&nbsp;|\s)*<\/h1>/, '');
    this.surveyA['主訴與就診問題_主訴'] = data;
  }

  filterData(...arrays: Array<any>): any[] {
    return arrays.flatMap((data) =>
      Object.values(data).flatMap((subArray) =>
        Array.isArray(subArray)
          ? subArray.filter(
              (item) =>
                typeof item === 'object' &&
                item !== null &&
                !Array.isArray(item)
            )
          : []
      )
    );
  }

  getValueSurveyA(key: string, text?: string): string {
    const item =
      text !== undefined && this.surveyA[key] !== undefined
        ? this.surveyA[key].find((item) => {
            if (item.text === text) return item.value;
          })
        : this.surveyA[key];
    return typeof item === 'string'
      ? this.surveyA[key]
      : item !== undefined
      ? item.value
      : '';
  }

  formatDate(date: string): string {
    if (date != undefined) {
      const dateSlpit = date.substring(0, 10).split('-');

      return `${parseInt(dateSlpit[0]) - 1911} 年 ${dateSlpit[1]}月 ${
        dateSlpit[2]
      }日`;
    }
    return `年 月 日`;
  }

  getValueSurveyB(key: string, text?: string): string {
    const item =
      text !== undefined && this.surveyB[key] !== undefined
        ? this.surveyB[key].find((item) => {
            if (item.text === text) return item.value;
          })
        : this.surveyB[key];
    return typeof item === 'string'
      ? this.surveyB[key]
      : item !== undefined
      ? item.value
      : '';
  }

  getValueSurveyC(key: string, text?: string): string {
    const item =
      text !== undefined && this.surveyC[key] !== undefined
        ? this.surveyC[key].find((item) => {
            if (item.text === text) return item.value;
          })
        : this.surveyC[key];
    return typeof item === 'string'
      ? this.surveyC[key]
      : item !== undefined
      ? item.value
      : '';
  }

  checkGender(gender: string, defaultValue: string) {
    return gender === defaultValue ? '◼️ ' : '▢';
  }
  checkIsReevaluationRequired(value: boolean, defaultValue: boolean) {
    return value === defaultValue ? '◼️ ' : '▢';
  }
  isChecked(text: string, key?: string): boolean {
    const item = this.combinedData.find((item) => item.text === text);
    return item ? item.checked === true : false;
  }

  isCheckedBoxSurveyA(text: string, key?: string): string {
    const item = this.surveyA[key ? key : ''].find(
      (item) => item.text === text
    );
    return item ? (item.checked === true ? '◼️ ' : '▢') : '▢';
  }

  isCheckedBoxSurveyB(text: string, key?: string): string {
    const item = this.surveyB[key ? key : ''].find(
      (item) => item.text === text
    );
    return item ? (item.checked === true ? '◼️ ' : '▢') : '▢';
  }

  isCheckedBoxSurveyC(text: string, key?: string): string {
    const item = this.surveyC[key ? key : ''].find(
      (item) => item.text === text
    );
    return item ? (item.checked === true ? '◼️ ' : '▢') : '▢';
  }

  isCheckedCircleSurveyA(text: string, key?: string): string {
    const item = this.surveyA[key ? key : ''].find(
      (item) => item.text === text
    );
    return item ? (item.checked === true ? '⬤' : '〇') : '〇';
  }

  isCheckedCircleSurveyB(text: string, key?: string): string {
    const item = this.surveyB[key ? key : ''].find(
      (item) => item.text === text
    );
    return item ? (item.checked === true ? '⬤' : '〇') : '〇';
  }

  isCheckedCircleSurveyC(text: string, key?: string): string {
    const item = this.surveyC[key ? key : ''].find(
      (item) => item.text === text
    );
    return item ? (item.checked === true ? '⬤' : '〇') : '〇';
  }

  async generatePdf(): Promise<void> {
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 1.5,
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    const clonedElement: HTMLElement = this.el.nativeElement.cloneNode(true);
    this.renderer.setStyle(clonedElement, 'display', 'block');

    if (this.tailAttachementUrl === 'docx') {
      const content = await this.loadWordFile(this.attachmentUrl);
      clonedElement.innerHTML += content;
      await html2pdf().from(clonedElement).set(options).save();
    } else {
      const pdfBlob = await html2pdf()
        .from(clonedElement)
        .set(options)
        .outputPdf('blob');
      const mergedPDFBlob = await this.mergeFilePdf(
        pdfBlob,
        this.attachmentUrl
      );
      saveAs(mergedPDFBlob, '逸延綜合醫院 綜合報告書.pdf');
    }

    clonedElement.remove();
  }
  async wordToArrayBuffer(url: string): Promise<ArrayBuffer> {
    const response = await this.http
      .get(url, { responseType: 'arraybuffer' })
      .toPromise();
    return response as ArrayBuffer;
  }
  async loadWordFile(filePath: string): Promise<string> {
    const arrayBuffer = await this.wordToArrayBuffer(filePath);
    const content = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    return content.value;
  }

  async mergeFilePdf(pdfBlob: any, stringPath: string) {
    // 'https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK'
    const newPDFBytes = await fetch(stringPath).then((response) =>
      response.arrayBuffer()
    );

    const newPDF = await PDFDocument.load(newPDFBytes);
    const existingPDF = await PDFDocument.load(await pdfBlob.arrayBuffer());

    const pageCount = newPDF.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const [newPage] = await existingPDF.copyPages(newPDF, [i]);
      existingPDF.addPage(newPage);
    }

    const mergedPDFBytes = await existingPDF.save();
    const mergedPDFBlob = new Blob([mergedPDFBytes], {
      type: 'application/pdf',
    });

    return mergedPDFBlob;
  }
}
