import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BlogService } from './blog.service';
import { Blog } from '../../shared/models/blog.model';

const mockBlog: Blog = {
  id: 1,
  title: 'Test Blog',
  description: 'Test description for blog post',
  image_url: null,
  user_id: 1,
  username: 'alice',
  like_count: 0,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogService, provideHttpClient(), provideHttpClientTesting()],
    });
    service  = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getBlogs() calls GET /blogs with query params', () => {
    service.getBlogs({ page: 1, pageSize: 5, keyword: 'angular', sort: 'newest' }).subscribe(res => {
      expect(res.data).toEqual([mockBlog]);
    });

    const req = httpMock.expectOne(r => r.url === 'http://localhost:3000/api/blogs');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('keyword')).toBe('angular');
    req.flush({ success: true, data: [mockBlog], meta: { total: 1, page: 1, pageSize: 5 } });
  });

  it('getBlogById() calls GET /blogs/:id', () => {
    service.getBlogById(1).subscribe(res => {
      expect(res.data?.id).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/blogs/1');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockBlog });
  });

  it('deleteBlog() calls DELETE /blogs/:id', () => {
    service.deleteBlog(1).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/blogs/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true, message: 'Blog deleted.' });
  });

  it('toggleLike() calls POST /blogs/:id/like', () => {
    service.toggleLike(1).subscribe(res => {
      expect(res.data?.liked).toBeTrue();
      expect(res.data?.likeCount).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/blogs/1/like');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: { liked: true, likeCount: 1 } });
  });
});
