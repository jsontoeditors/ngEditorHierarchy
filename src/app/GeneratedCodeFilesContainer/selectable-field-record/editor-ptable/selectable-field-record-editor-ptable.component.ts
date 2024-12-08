

  import { Component, OnInit } from '@angular/core'
  import { Router } from '@angular/router'
  import { FormBuilder } from '@angular/forms'
  import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
  import { Store, select } from '@ngrx/store'
  import { Update } from '@ngrx/entity'

  import { EnumEditorOperationType, show_CodeOutput_Modal, deepClone, display_DataArray_In_GridCell } from '../../editor-hierarchy-shared/editor-hierarchy-shared.component'

  import { SelectableFieldRecordEditorFormComponent } from '../editor-form/selectable-field-record-editor-form.component'

  import { SelectableFieldRecordActionTypes, SelectableFieldRecordState, selectAllSelectableFieldRecords } from '../selectable-field-record.store'
  import { SelectableFieldRecord, Enum_EditorComponent_Type } from '../selectable-field-record.model'
  import { SelectableFieldRecordService } from '../selectable-field-record.service'

import { NumberValueChildEditorFormComponent } from "../number-value/editor-form/number-value-child-editor-form.component";

import { StringValueChildEditorFormComponent } from "../string-value/editor-form/string-value-child-editor-form.component";

import { NumberArrayChildEditorFormComponent } from "../number-array/editor-form/number-array-child-editor-form.component";

import { StringArrayChildEditorFormComponent } from "../string-array/editor-form/string-array-child-editor-form.component";



  @Component({
    selector: "selectable-field-record-editor-ptable",

templateUrl: './selectable-field-record-editor-ptable.component.html', 

styleUrls: ['./selectable-field-record-editor-ptable.component.scss'] 

}) 

  export class SelectableFieldRecordEditorPTableComponent implements OnInit {

    //#region Main
    agGridThemeName: string = 'ag-theme-alpine-dark'
    delegate_display_DataArray_In_GridCell = display_DataArray_In_GridCell
    isInModal: boolean = false
    editedObjects?: any[] = undefined

    constructor(public bsModalRef: BsModalRef,
      private fb: FormBuilder,
      private router: Router,
      private store: Store,
      private codegenEntityService: SelectableFieldRecordService,
      private modalService: BsModalService ){

    }


    ngOnInit() {

      this.editedObjects = []

      this.store.dispatch(SelectableFieldRecordActionTypes.loadSelectableFieldRecords())
      this.store.pipe(select(selectAllSelectableFieldRecords)).subscribe (entLst => {
        this.editedObjects = entLst.map<SelectableFieldRecord>(ent => {
          let ent1 = deepClone(ent)
          return SelectableFieldRecord.createFrom(ent1)
        })
      })

    } // end of fucntion

    hideEditorPTable(event: any){
      this.bsModalRef.hide()
    }

    runtimeMessageLines: string[] = []

    dspMsg(msg: string){
      //if(!this.runtimeMessageLines)
      this.runtimeMessageLines = []
      this.runtimeMessageLines.push(msg)
    }

    clrMsg(){
      this.runtimeMessageLines = []
    }

    outputJsonString(){

      let str = JSON.stringify(this.editedObjects, null, 4)
      show_CodeOutput_Modal(this.modalService, 'SelectableFieldRecords', str, 'modal-xl')
    }

    //#endregion

    //#region Row Record Editors

    // When child editors return to the top editor ptable, save the changes to DB.
    curSelectedSelectableFieldRecord: any

    save_SelectedSelectableFieldRecord(){
      const update: Update<SelectableFieldRecord> = {
        id:  this.curSelectedSelectableFieldRecord.id,
        changes: deepClone(this.curSelectedSelectableFieldRecord)
      }
      this.store.dispatch(SelectableFieldRecordActionTypes.updateSelectableFieldRecord({ update }))
      this.dspMsg('SelectableFieldRecord with id = ' + update.id + ' was updated and saved to DB.')
    }


    showCreateForm(field: string, rowIndex: number = undefined) {
      const config: any = {
        class: 'modal-md' , backdrop: true, ignoreBackdropClick: true,
        initialState: {
          parentEditor: this,
          parentOnClosedHandler: this.onClosedRowEditor_create,
          parentDataArray: this.editedObjects,
          parentDataIndex: undefined,
          parentDataObject: undefined,
          parentDataField: undefined,
          editorOperationType: EnumEditorOperationType.Create
        }
      }
      let modalRef = this.modalService.show(SelectableFieldRecordEditorFormComponent, config)
      SelectableFieldRecord.topComponentType = Enum_EditorComponent_Type.EditorPTable
    }

    onClosedRowEditor_create(resultObject: any){

      this.store.dispatch(SelectableFieldRecordActionTypes.createSelectableFieldRecord({ selectableFieldRecord: {...resultObject } }))
      this.dspMsg('SelectableFieldRecord with id = ' + resultObject.id + ' was created and saved to DB.')
    }

    showUpdateForm(field: string, rowIndex: number = undefined) {

      this.curSelectedSelectableFieldRecord = this.editedObjects[rowIndex]

      const config: any = {
        class: 'modal-md' , backdrop: true, ignoreBackdropClick: true,
        initialState: {
          parentEditor: this,
          parentOnClosedHandler: this.onClosedRowEditor_update,
          parentDataArray: this.editedObjects,
          parentDataIndex: rowIndex,
          parentDataObject: undefined,
          parentDataField: undefined,
          editorOperationType: EnumEditorOperationType.Update
        }
      }
      let modalRef = this.modalService.show(SelectableFieldRecordEditorFormComponent, config)
      SelectableFieldRecord.topComponentType = Enum_EditorComponent_Type.EditorPTable
    }

    onClosedRowEditor_update(edited: SelectableFieldRecord){

      this.save_SelectedSelectableFieldRecord()
    }

    showDeleteForm(field: string, rowIndex: number = undefined) {
      const config: any = {
        class: 'modal-md' , backdrop: true, ignoreBackdropClick: true,
        initialState: {
          parentEditor: this,
          parentOnClosedHandler: this.onClosedRowEditor_delete,
          parentDataArray: this.editedObjects,
          parentDataIndex: rowIndex,
          parentDataObject: undefined,
          parentDataField: undefined,
          editorOperationType: EnumEditorOperationType.Delete
        }
      }
      let modalRef = this.modalService.show(SelectableFieldRecordEditorFormComponent, config)
      SelectableFieldRecord.topComponentType = Enum_EditorComponent_Type.EditorPTable
    }

    onClosedRowEditor_delete(resultObject: any){

      this.store.dispatch(SelectableFieldRecordActionTypes.deleteSelectableFieldRecord({ selectableFieldRecordId: resultObject.id }))
      this.dspMsg('SelectableFieldRecord with id = ' + resultObject.id + ' was deleted from DB.')
    }

    //#endregion

    //#region Fiele Value Editors

    private chooseFieleValueEditorComponent(fld: string): any{
      if(!fld) return undefined // unknown component.


else if( fld == "NumberValue" ) return NumberValueChildEditorFormComponent
else if( fld == "StringValue" ) return StringValueChildEditorFormComponent
else if( fld == "NumberArray" ) return NumberArrayChildEditorFormComponent
else if( fld == "StringArray" ) return StringArrayChildEditorFormComponent



      return undefined
    }


    showFieldEditorForm(field: string, rowIndex: number = undefined) {

      this.curSelectedSelectableFieldRecord = this.editedObjects[rowIndex]

      const config: any = {
        class: 'modal-md' , backdrop: true, ignoreBackdropClick: true,
        initialState: {
          isInModal: true,
          parentEditor: this,
          parentOnClosedHandler: this.onClosedFieldEditorForm,
          parentDataArray: undefined,
          parentDataIndex: undefined,
          parentDataObject: this.editedObjects[rowIndex],
          parentDataField: field,
          editorOperationType: EnumEditorOperationType.Update
        }
      }
      let cmpnt = this.chooseFieleValueEditorComponent(field)
      if(!cmpnt) return
      let modalRef = this.modalService.show(cmpnt, config)
      SelectableFieldRecord.topComponentType = Enum_EditorComponent_Type.EditorPTable
    }

    onClosedFieldEditorForm(resultObject: any){

      this.save_SelectedSelectableFieldRecord()
    }

    showFieldEditorPTable(field: string, rowIndex: number = undefined) {

      this.curSelectedSelectableFieldRecord = this.editedObjects[rowIndex]

      const config: any = {
        class: 'modal-xl' , backdrop: true, ignoreBackdropClick: true,
        initialState: {
          isInModal: true,
          parentEditor: this,
          parentOnClosedHandler: this.onClosedFieldEditorPTable,
          parentDataArray: undefined,
          parentDataIndex: undefined,
          parentDataObject: this.editedObjects[rowIndex],
          parentDataField: field,
          editorOperationType: EnumEditorOperationType.Update
        }
      }
      let cmpnt = this.chooseFieleValueEditorComponent(field)
      if(!cmpnt) return
      let modalRef = this.modalService.show(cmpnt, config)
      SelectableFieldRecord.topComponentType = Enum_EditorComponent_Type.EditorPTable
    }

    onClosedFieldEditorPTable(resultObject: any){
      this.save_SelectedSelectableFieldRecord()
    }


    //#endregion

  } // end of class

