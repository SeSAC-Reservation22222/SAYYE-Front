"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import AdminGuard from "@/components/common/AdminGuard";
import { courseApi } from "@/lib/api/course";
import type { CourseResponse, CourseRequest } from "@/types";

export default function AdminClassesPage() {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null);
  const [formData, setFormData] = useState<CourseRequest>({
    courseName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseApi.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("클래스 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.courseName.trim()) {
      alert("클래스 이름을 입력해주세요.");
      return;
    }
    if (!formData.startDate) {
      alert("시작 날짜를 선택해주세요.");
      return;
    }
    if (!formData.endDate) {
      alert("종료 날짜를 선택해주세요.");
      return;
    }

    try {
      // 전송할 데이터 준비 (백엔드 필드명과 정확히 일치)
      const requestData: CourseRequest = {
        courseName: formData.courseName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      // 디버깅: 전송할 데이터 확인
      console.log("전송할 데이터:", requestData);

      if (editingCourse) {
        await courseApi.updateCourse(editingCourse.id, requestData);
        alert("클래스 정보가 수정되었습니다.");
      } else {
        await courseApi.createCourse(requestData);
        alert("클래스가 생성되었습니다.");
      }
      setShowForm(false);
      setEditingCourse(null);
      setFormData({
        courseName: "",
        startDate: "",
        endDate: "",
      });
      fetchCourses();
    } catch (error: any) {
      // 상세한 에러 메시지 표시
      console.error("클래스 생성/수정 에러:", error);
      let errorMessage = "작업에 실패했습니다.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          // validation 에러인 경우
          const firstErrorKey = Object.keys(errorData)[0];
          if (firstErrorKey && errorData[firstErrorKey]) {
            errorMessage = Array.isArray(errorData[firstErrorKey]) 
              ? errorData[firstErrorKey][0] 
              : errorData[firstErrorKey];
          }
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleEdit = (course: CourseResponse) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName,
      startDate: course.startDate,
      endDate: course.endDate,
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await courseApi.deleteCourse(courseId);
      alert("클래스가 삭제되었습니다.");
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header showLogout />
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black tracking-tight">클래스 관리</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "취소" : "새 클래스 추가"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingCourse ? "클래스 수정" : "새 클래스 추가"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="클래스 이름"
                  value={formData.courseName}
                  onChange={(e) =>
                    setFormData({ ...formData, courseName: e.target.value })
                  }
                  required
                />
                <Input
                  label="시작 날짜"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
                <Input
                  label="종료 날짜"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary">
                    {editingCourse ? "수정" : "생성"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCourse(null);
                      setFormData({
                        courseName: "",
                        startDate: "",
                        endDate: "",
                      });
                    }}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{course.courseName}</h3>
                    <div className="flex flex-col gap-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <p>시작일: {course.startDate}</p>
                      <p>종료일: {course.endDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(course)}
                      size="sm"
                    >
                      수정
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(course.id)}
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

