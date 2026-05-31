import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Blog, PaginatedBlogs } from '../../shared/models/blog.model';

export interface BlogQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sort?: 'newest' | 'oldest';
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly API = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {}

  getBlogs(params: BlogQueryParams): Observable<ApiResponse<Blog[]>> {
    let httpParams = new HttpParams();
    if (params.page)     httpParams = httpParams.set('page',     params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.keyword)  httpParams = httpParams.set('keyword',  params.keyword);
    if (params.sort)     httpParams = httpParams.set('sort',     params.sort);
    return this.http.get<ApiResponse<Blog[]>>(this.API, { params: httpParams });
  }

  getBlogById(id: number): Observable<ApiResponse<Blog>> {
    return this.http.get<ApiResponse<Blog>>(`${this.API}/${id}`);
  }

  createBlog(data: FormData): Observable<ApiResponse<Blog>> {
    return this.http.post<ApiResponse<Blog>>(this.API, data);
  }

  updateBlog(id: number, data: FormData): Observable<ApiResponse<Blog>> {
    return this.http.put<ApiResponse<Blog>>(`${this.API}/${id}`, data);
  }

  deleteBlog(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API}/${id}`);
  }

  toggleLike(id: number): Observable<ApiResponse<{ liked: boolean; likeCount: number }>> {
    return this.http.post<ApiResponse<{ liked: boolean; likeCount: number }>>(`${this.API}/${id}/like`, {});
  }

  getMyBlogs(): Observable<ApiResponse<Blog[]>> {
    return this.http.get<ApiResponse<Blog[]>>(`${this.API}/my-posts`);
  }
}
