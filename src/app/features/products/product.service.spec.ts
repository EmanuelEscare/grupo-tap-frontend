import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists products from a named products collection', () => {
    service.list().subscribe((products) => {
      expect(products).toEqual([{ id: 'p1', name: 'Aceite', brand: 'Tap', price: 120 }]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({
      products: [{ id: 'p1', name: 'Aceite', brand: 'Tap', price: 120 }],
    });
  });

  it('lists products from a paginated data response', () => {
    service.list().subscribe((products) => {
      expect(products).toEqual([{ id: 'p2', name: 'Filtro', brand: 'Tap', price: 80 }]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    req.flush({
      data: {
        data: [{ id: 'p2', name: 'Filtro', brand: 'Tap', price: 80 }],
      },
    });
  });
});
