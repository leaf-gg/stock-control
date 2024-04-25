import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: [],
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }
  getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsDatas();

    if (productsLoaded.length > 0) {
      console.log('products data', this.productsDatas);
      this.productsDatas = productsLoaded;
    } else {
      this.getAPIProductsDatas();
    }

    console.log('products data', this.productsDatas);
  }
  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            console.log('products data', this.productsDatas);
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error to find products',
            life: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      console.log('event data received', event);
    }
  }

  handleDeleteProductAction(event: {
    product_id: string;
    productName: string;
  }): void {
    if (event) {
      console.log('event data received from delete product', event);
      this.confirmationService.confirm({
        message: `Are you sure to delete a product named: ${event?.productName}?`,
        header: 'Delete confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => this.deleteProduct(event?.product_id)
      })
    }
  }
  deleteProduct(product_id: string) {
    if(product_id){
      this.productsService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response){
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted with success!',
              life: 2500,
            });

            this.getAPIProductsDatas();

          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove product, please try again later',
            life: 2500,
          });

        }
      })

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
