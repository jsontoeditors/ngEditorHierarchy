

  import { Component, OnInit } from '@angular/core'
  import { Router } from '@angular/router'
  import { FormBuilder } from '@angular/forms'
  import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
  import { Store, select } from '@ngrx/store'
  import { Update } from '@ngrx/entity'

  import { OpenFieldEditorCellRendererComponent, DataTypeArrayCellRendererComponent, deepClone  } from '../../editor-hierarchy-shared/editor-hierarchy-shared.component'
  import { EnumEditorOperationType, show_CodeOutput_Modal, SimpleColorCellRendererComponent } from '../../editor-hierarchy-shared/editor-hierarchy-shared.component'

  import { SchoolTeacherEditorFormComponent } from '../editor-form/school-teacher-editor-form.component'

  import { SchoolTeacherActionTypes, SchoolTeacherState, selectAllSchoolTeachers } from '../school-teacher.store'
  import { SchoolTeacher, Enum_EditorComponent_Type } from '../school-teacher.model'
  import { SchoolTeacherService } from '../school-teacher.service'

import { AddressChildEditorFormComponent } from "../address/editor-form/address-child-editor-form.component";

import { ContactChildEditorFormComponent } from "../contact/editor-form/contact-child-editor-form.component";




  @Component({
    selector: "school-teacher-editor-aggrid", 
templateUrl: './school-teacher-editor-aggrid.component.html', 

styleUrls: ['./school-teacher-editor-aggrid.component.scss'] 

}) 

  export class SchoolTeacherEditorAgGridComponent implements OnInit {

    //#region Main
    agGridThemeName: string = 'ag-theme-alpine-dark'

    constructor(public bsModalRef: BsModalRef,
      private fb: FormBuilder,
      private router: Router,
      private store: Store,
      private codegenEntityService: SchoolTeacherService,
      private modalService: BsModalService ){

    }

    ngOnInit() {

      this.editedObjects = []
      this.initEditorAgGrid()

    }

    hideEditorAgGrid(event: any){
      this.bsModalRef.hide()
    }

    runtimeMessageLines: string[] = []

    dspMsg(msg: string){

      this.runtimeMessageLines = []
      this.runtimeMessageLines.push(msg)
    }

    clrMsg(){
      this.runtimeMessageLines = []
    }

    outputJsonString(){

      let str = JSON.stringify(this.editedObjects, null, 4)
      show_CodeOutput_Modal(this.modalService, 'SchoolTeachers', str, 'modal-xl')
    }

    //#endregion

    //#region Init and Open AgGrid
    isInModal: boolean = false
    editor_agGrid_rowData?: any[]
    editor_agGrid_columnDefs?: any[]
    editor_agGrid_defaultColDef: any
    editor_agGrid_frameworkComponents: any
    editor_agGrid_gridApi: any
    editor_agGrid_gridColumnApi: any
    editor_agGrid_getRowNodeId: any
    editor_agGrid_gridOptions: any

    editedObjects?: any[] = undefined

    initEditorAgGrid(){

      this.editor_agGrid_frameworkComponents = {
        simpleColorCellRenderer: SimpleColorCellRendererComponent,
        openFieldEditorCellRenderer: OpenFieldEditorCellRendererComponent,
        dataTypeArrayCellRenderer: DataTypeArrayCellRendererComponent
      }
      this.editor_agGrid_defaultColDef = { sortable: true, filter: true, resizable: true, maxWidth:500, suppressMovable: true }
      this.editor_agGrid_getRowNodeId = (params: any) => {
        return params.data.id
      }

      this.editor_agGrid_columnDefs = this.colDefs

    } // end of fucntion

    editor_agGrid_onRowDataChanged(event: any){
      if(this.editor_agGrid_gridColumnApi)
        this.editor_agGrid_gridColumnApi.autoSizeAllColumns()
    }

    editor_agGrid_onGridReady(params: { api: any; columnApi: any }) {
      this.editor_agGrid_gridApi = params.api
      this.editor_agGrid_gridColumnApi = params.columnApi

      this.store.dispatch(SchoolTeacherActionTypes.loadSchoolTeachers())
      this.store.pipe(select(selectAllSchoolTeachers)).subscribe (entLst => {
        this.editedObjects = entLst.map<SchoolTeacher>(ent => {
          let ent1 = deepClone(ent)
          return SchoolTeacher.createFrom(ent1)
        })

        this.editor_agGrid_rowData = this.editedObjects
        this.editor_agGrid_gridApi?.setRowData(this.editor_agGrid_rowData) // This is required.
      })
    }  // end of fucntion

    colDefs =[
      { cellRenderer: 'openFieldEditorCellRenderer', width: 60, tooltipField: 'id',
        cellRendererParams: {
          icon: 'edit', display: '',  tooltip: 'Edit',
          parentComponent: this, parentFunction: this.showUpdateForm, parentDataField: undefined
        }
      },
      { cellRenderer: 'openFieldEditorCellRenderer', width: 60,
        cellRendererParams: {
          icon: 'trash', display: '', tooltip: 'Delete',
          parentComponent: this, parentFunction: this.showDeleteForm, parentDataField: undefined
        }
      },

{ field: "Code", tooltipField:  "Code", headerName: "Code", flex: 1 }, 
{ field: "Title", tooltipField:  "Title", headerName: "Title", flex: 1 }, 
{ field: "FirstName", tooltipField:  "FirstName", headerName: "FirstName", flex: 1 }, 
{ field: "LastName", tooltipField:  "LastName", headerName: "LastName", flex: 1 }, 
{ field: "DOB", tooltipField:  "DOB", headerName: "DOB", flex: 1 }, 
{ field: "Gender", tooltipField:  "Gender", headerName: "Gender", flex: 1 }, 
{ field: "Active", tooltipField:  "Active", headerName: "Active", flex: 1 }, 
{ field: "Level", tooltipField:  "Level", headerName: "Level", flex: 1 }, 
{ field: "Specialty", tooltipField:  "Specialty", headerName: "Specialty", flex: 1 }, 
{ field: "Qualification", tooltipField:  "Qualification", headerName: "Qualification", flex: 1 }, 

{
  field: 'Address',
  headerName: 'Address',
  flex: 1,
  cellRenderer: 'openFieldEditorCellRenderer',
  cellRendererParams: {
    parentComponent: this,
    parentFunction: this.showFieldEditorForm,
    parentDataField: 'Address',
    icon: null || 'box-open',
    display: null || '',
    tooltip: null || ''
  }
}, 

{
  field: 'Contact',
  headerName: 'Contact',
  flex: 1,
  cellRenderer: 'openFieldEditorCellRenderer',
  cellRendererParams: {
    parentComponent: this,
    parentFunction: this.showFieldEditorForm,
    parentDataField: 'Contact',
    icon: null || 'box-open',
    display: null || '',
    tooltip: null || ''
  }
}, 


    ]

    //#endregion

    //#region Row Record Editors

    // When child editors return to the top editor aggrid, save the changes to DB.
    curSelectedSchoolTeacher: any

    save_SelectedSchoolTeacher(){
      const update: Update<SchoolTeacher> = {
        id:  this.curSelectedSchoolTeacher.id,
        changes: deepClone(this.curSelectedSchoolTeacher)
      }
      this.store.dispatch(SchoolTeacherActionTypes.updateSchoolTeacher({ update }))
      this.dspMsg('SchoolTeacher with id = ' + update.id + ' was updated and saved to DB.')
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
      let modalRef = this.modalService.show(SchoolTeacherEditorFormComponent, config)
      SchoolTeacher.topComponentType = Enum_EditorComponent_Type.EditorAgGrid

    }

    onClosedRowEditor_create(resultObject: any){
      this.editor_agGrid_gridApi?.setRowData(this.editedObjects)
      this.editor_agGrid_gridApi?.redrawRows()

      this.store.dispatch(SchoolTeacherActionTypes.createSchoolTeacher({ schoolTeacher: {...resultObject } }))
      this.dspMsg('SchoolTeacher with id = ' + resultObject.id + ' was created and saved to DB.')
    }

    showUpdateForm(field: string, rowIndex: number = undefined) {

      this.curSelectedSchoolTeacher = this.editedObjects[rowIndex]

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
      let modalRef = this.modalService.show(SchoolTeacherEditorFormComponent, config)
      SchoolTeacher.topComponentType = Enum_EditorComponent_Type.EditorAgGrid

    }

    onClosedRowEditor_update(edited: SchoolTeacher){
      this.editor_agGrid_gridApi?.redrawRows()
      this.save_SelectedSchoolTeacher()
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
      let modalRef = this.modalService.show(SchoolTeacherEditorFormComponent, config)
      SchoolTeacher.topComponentType = Enum_EditorComponent_Type.EditorAgGrid

    }

    onClosedRowEditor_delete(resultObject: any){
      this.editor_agGrid_gridApi?.setRowData(this.editedObjects)
      this.editor_agGrid_gridApi?.redrawRows()

      this.store.dispatch(SchoolTeacherActionTypes.deleteSchoolTeacher({ schoolTeacherId: resultObject.id }))
      this.dspMsg('SchoolTeacher with id = ' + resultObject.id + ' was deleted from DB.')
    }

    //#endregion

    //#region Fiele Value Editors

    private chooseFieleValueEditorComponent(fld: string): any{
      if(!fld) return undefined // unknown component.


else if( fld == "Address" ) return AddressChildEditorFormComponent
else if( fld == "Contact" ) return ContactChildEditorFormComponent



      return undefined
    }


    showFieldEditorForm(field: string, rowIndex: number = undefined) {

      this.curSelectedSchoolTeacher = this.editedObjects[rowIndex]

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
      SchoolTeacher.topComponentType = Enum_EditorComponent_Type.EditorAgGrid

    }

    onClosedFieldEditorForm(resultObject: any){
      this.editor_agGrid_gridApi?.setRowData(this.editedObjects)
      this.editor_agGrid_gridApi?.redrawRows()
      this.save_SelectedSchoolTeacher()
    }

    showFieldEditorAgGrid(field: string, rowIndex: number = undefined) {

      this.curSelectedSchoolTeacher = this.editedObjects[rowIndex]

      const config: any = {
        class: 'modal-xl' , backdrop: true, ignoreBackdropClick: true,
        initialState: {
          isInModal: true,
          parentEditor: this,
          parentOnClosedHandler: this.onClosedFieldEditorAgGrid,
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
      SchoolTeacher.topComponentType = Enum_EditorComponent_Type.EditorAgGrid
    }

    onClosedFieldEditorAgGrid(resultObject: any){
      this.editor_agGrid_gridApi?.setRowData(this.editedObjects)
      this.editor_agGrid_gridApi?.redrawRows()
      this.save_SelectedSchoolTeacher()
    }

    //#endregion

  } // end of class

