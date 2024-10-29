import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.css']
})
export class ReusableTableComponent {

  @ViewChild('dt') dt!: Table; // Use ! to indicate it's definitely assigned

  //Input
  @Input() Items: any[] = []; // All Items In Table
  @Input() Item: any; // Item In table BY ID
  @Input() columns: any[] = []; // table columns NAMES
  @Input() filters: any[] = []; // table columns NAMES
  @Input() canAdd: boolean = false; // permisions
  @Input() canEdit: boolean = false; // permisions
  @Input() canDelete: boolean = false; // permisions
  @Input() view: any // table columns NAMES
  @Input() title: string = ''; //table title
  @Input() statuses: any[] = []; // isActive 
  @Input() globalFilterFields: string[] = []; // Filters
  @Input() confirmDeleteDialog: boolean = false; // boolean for display the delete dialog
  @Input() confirmChangeActivationDialog: boolean = false; // boolean for display the change activation Dialog
  @Input() submitted: boolean = false; // check on submitted
  @Input() totalRecords!: number;
  @Input() lazy!: boolean;


  // Output
  @Output() openNew = new EventEmitter<void>(); // handle Api for add New item Dialog || go to the new page for add
  @Output() editItem = new EventEmitter<any>(); // handle Api for Edit item Dialog || go to the new page for update
  @Output() deleteItem = new EventEmitter<any>(); // handle Api for delete item
  @Output() changeActivationOfItem = new EventEmitter<any>(); // handle Api for Change Activation of item
  @Output() openDeleteDialog = new EventEmitter<any>(); // open Delete Dialog
  @Output() openActivationDialog = new EventEmitter<any>(); // Open chaneg Activation Dialog
  @Output() hideDialog = new EventEmitter<void>(); // Close Dialog (for edit || Delete || Change Activation)
  @Output() exportToExcel = new EventEmitter<void>(); // handle Api for EXPORT To EXCEL
  @Output() onlazyload = new EventEmitter<TableLazyLoadEvent>()
  @Output() getName = new EventEmitter<TableLazyLoadEvent>()




  

  constructor() { }

  getSearchVal(ev:any)
  {
    this.getName.emit(ev)
    console.log(ev.target.value)
  }
  
  // get filteredData() {
  //   return this.Items.filter(item => {
  //     return Object.keys(this.filters).every(key => 
  //       item[key]?.toString().toLowerCase().includes(this.filters[key].toLowerCase())
  //     );
  //   });
  // }
  loadItems(event : TableLazyLoadEvent)
  {
    this.onlazyload.emit(event)
  }


  imageUrl:string=''
  viewImageDialog:boolean=false;

  // getImage(event:any){
  //   this.viewImageDialog=true;
  //   console.log(event.images[0])
  // }
  viewImage(item:any)
    {
      this.viewImageDialog = true
      this.imageUrl = item.images[0];
    }

    
  
}
