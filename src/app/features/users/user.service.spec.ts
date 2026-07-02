import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('normalizes backend user field as email', () => {
    service.list().subscribe((users) => {
      expect(users).toEqual([
        {
          id: '6a456c3933913dcd0b0518da',
          code: null,
          user: 'test@grupotap.com',
          name: 'Clifton Quitzon',
          email: 'test@grupotap.com',
          created_at: '01/07/2026 19:36',
        },
      ]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush({
      users: [
        {
          id: '6a456c3933913dcd0b0518da',
          code: null,
          user: 'test@grupotap.com',
          name: 'Clifton Quitzon',
          created_at: '01/07/2026 19:36',
        },
      ],
    });
  });
});
