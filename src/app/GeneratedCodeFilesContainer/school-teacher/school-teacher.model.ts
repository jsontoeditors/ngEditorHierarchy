

  export enum Enum_EditorComponent_Type {
    EditorForm = 1,
    EditorAgGrid = 2,
    EditorPTable = 3
  }

  export enum EnumSelectorOptionSource {
    ValueArray = "ValueArray",
    LabelledValueArray = "LabelledValueArray",
    ObjectArray = "ObjectArray"
  }

  export interface ISchoolTeacher {

id: string 
Code: number
Title: string
FirstName: string
LastName: string
DOB: string
Gender: string
Active: boolean
Level: string
Specialty: string
Qualification: string
Address: any
Contact: any


  } // end of interface

  export class SchoolTeacher implements ISchoolTeacher {

id: string = ''
Code: number = null
Title: string = null
FirstName: string = null
LastName: string = null
DOB: string = null
Gender: string = null
Active: boolean = false
Level: string = null
Specialty: string = null
Qualification: string = null
Address: any = null
Contact: any = null


    constructor() {

    }

    fromValueObject(obj: any) {
      if(!obj) return

this.id = obj.id 
this.Code = obj.Code
this.Title = obj.Title
this.FirstName = obj.FirstName
this.LastName = obj.LastName
this.DOB = obj.DOB
this.Gender = obj.Gender
this.Active = obj.Active
this.Level = obj.Level
this.Specialty = obj.Specialty
this.Qualification = obj.Qualification
this.Address = obj.Address
this.Contact = obj.Contact


    } // end of function

    toValueObject(): any {
      let obj:any = {}

obj.id = this.id 
obj.Code = this.Code
obj.Title = this.Title
obj.FirstName = this.FirstName
obj.LastName = this.LastName
obj.DOB = this.DOB
obj.Gender = this.Gender
obj.Active = this.Active
obj.Level = this.Level
obj.Specialty = this.Specialty
obj.Qualification = this.Qualification
obj.Address = this.Address
obj.Contact = this.Contact


      return obj

    } // end of function

    static createFrom(obj: any) {
      let inst = new SchoolTeacher()
      inst.fromValueObject(obj)
      return inst
    }

    static topComponentType: Enum_EditorComponent_Type

  }  // end of class

//#endregion

//#region More

//#endregion
  