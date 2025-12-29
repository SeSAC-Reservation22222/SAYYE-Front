"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import { roomApi } from "@/lib/api/room";
import { courseApi } from "@/lib/api/course";
import { reservationApi } from "@/lib/api/reservation";
import { getDecodedToken, isAdmin } from "@/lib/utils/jwt";
import type { RoomResponse, CourseResponse, ReservationRequest, AdminReservationRequest } from "@/types";

function ReserveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  // 현재 시간을 30분 단위로 반올림하는 함수
  const getRoundedCurrentTime = (): string => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // 30분 단위로 반올림
    let roundedMinutes = minutes < 30 ? 0 : 30;
    let roundedHours = hours;
    
    // 30분 이상이면 다음 시간으로 넘어가지만, 30분으로 설정
    // (예: 14:35 → 14:30, 14:40 → 15:00이 아니라 14:30)
    // 사용자 요구사항에 따라 14:09 → 14:00, 17:51 → 17:30
    if (minutes >= 30) {
      roundedMinutes = 30;
    } else {
      roundedMinutes = 0;
    }
    
    // 시간 범위 제한 (10:00 ~ 22:00)
    if (roundedHours < 10) {
      roundedHours = 10;
      roundedMinutes = 0;
    } else if (roundedHours >= 22) {
      roundedHours = 22;
      roundedMinutes = 0;
    }
    
    return `${roundedHours.toString().padStart(2, "0")}:${roundedMinutes.toString().padStart(2, "0")}:00`;
  };

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [startTime, setStartTime] = useState<string>(getRoundedCurrentTime());
  const [duration, setDuration] = useState<number>(2);
  const [formData, setFormData] = useState({
    courseId: "",
    userName: "",
    phoneLastNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    // 관리자 여부 확인
    const adminStatus = isAdmin();
    setIsAdminUser(adminStatus);

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsData, coursesData] = await Promise.all([
        roomApi.getRooms(),
        courseApi.getCourses(),
      ]);
      setRooms(roomsData);
      setCourses(coursesData);
      if (roomsData.length > 0) {
        const roomIdParam = searchParams.get("roomId");
        if (roomIdParam) {
          const matchedRoom = roomsData.find((room) => room.id === Number(roomIdParam));
          if (matchedRoom) {
            setSelectedRoom(matchedRoom.id);
            return;
          }
        }
        setSelectedRoom(roomsData[0].id);
      }
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setLoading(true);
    try {
      const endTime = calculateEndTime(startTime, duration);

      if (isAdminUser) {
        // 관리자인 경우: 시간과 날짜만 전송
        const adminReservationData: AdminReservationRequest = {
          startTime,
          endTime,
          reservationDate: selectedDate,
        };
        await reservationApi.createAdminReservation(selectedRoom, adminReservationData);
      } else {
        // 일반 사용자인 경우: 모든 정보 전송
        const reservationData: ReservationRequest = {
          courseId: Number(formData.courseId),
          userName: formData.userName,
          phoneLastNumber: formData.phoneLastNumber,
          startTime,
          endTime,
          reservationDate: selectedDate,
        };
        await reservationApi.createReservation(selectedRoom, reservationData);
      }

      alert("예약이 완료되었습니다!");
      router.push("/rooms");
    } catch (error: any) {
      // 백엔드에서 내려주는 에러 메시지 추출
      let errorMessage = "예약에 실패했습니다.";

      if (error.response?.data) {
        const errorData = error.response.data;

        // message 필드가 있는 경우
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        // futureTime 등의 필드가 있는 경우 (validation 에러)
        else if (typeof errorData === 'object') {
          const firstErrorKey = Object.keys(errorData)[0];
          if (firstErrorKey && errorData[firstErrorKey]) {
            errorMessage = errorData[firstErrorKey];
          }
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (start: string, hours: number): string => {
    const [h, m, s] = start.split(":").map(Number);
    const totalMinutes = h * 60 + m + hours * 60;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const paddedSeconds = s.toString().padStart(2, "0");
    return `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}:00`;
  };

  const timeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = 10 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}:00`,
      label: `${hour}:${minute}`,
    };
  });

  const durationOptions = [
    { value: "0.5", label: "30분" },
    { value: "1", label: "1시간" },
    { value: "1.5", label: "1시간 30분" },
    { value: "2", label: "2시간" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
            <h1 className="text-4xl font-black tracking-tight">회의실 예약</h1>
            <Card>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="font-bold text-base mb-2 block">예약 날짜</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setSelectedDate(newDate);
                      // 오늘 날짜로 변경되면 현재 시간으로 설정, 미래 날짜면 기본값(10:00)으로 설정
                      if (newDate === today) {
                        setStartTime(getRoundedCurrentTime());
                      } else {
                        setStartTime("10:00:00");
                      }
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-base mb-2 block">시작 시간</label>
                  <Select
                    options={timeOptions}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <p className="font-bold text-base mb-2">사용 시간 (최대 2시간)</p>
                  <div className="flex gap-2 mt-2">
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDuration(Number(option.value))}
                        className={`flex-1 h-10 px-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${duration === Number(option.value)
                          ? "bg-primary text-white"
                          : "bg-primary/20 hover:bg-primary/30"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold">예약자 정보</h3>
                  {isAdminUser ? (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
                      <span className="material-symbols-outlined text-primary inline-block align-middle mr-1">info</span>
                      관리자로 로그인되어 있습니다. 시간과 날짜만 선택하여 예약하세요.
                    </div>
                  ) : (
                    <>
                      <Select
                        label="클래스"
                        options={[
                          { value: "", label: "클래스 선택" },
                          ...courses.map((course) => ({
                            value: course.id.toString(),
                            label: course.courseName,
                          })),
                        ]}
                        value={formData.courseId}
                        onChange={(e) =>
                          setFormData({ ...formData, courseId: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="이름"
                        placeholder="이름"
                        value={formData.userName}
                        onChange={(e) =>
                          setFormData({ ...formData, userName: e.target.value })
                        }
                        required
                        minLength={2}
                      />
                      <Input
                        label="식별번호 (숫자 4자리)"
                        placeholder="1234"
                        type="tel"
                        pattern="[0-9]{4}"
                        value={formData.phoneLastNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneLastNumber: e.target.value })
                        }
                        required
                        maxLength={4}
                      />
                    </>
                  )}
                </div>

                <Button type="submit" fullWidth disabled={loading}>
                  예약 확정하기
                </Button>
              </form>
            </Card>
          </aside>
          <section className="flex-1">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedDate && new Date(selectedDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </h2>
                </div>
              </div>
              <Card>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">예약 정보 확인</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      선택하신 정보가 맞는지 확인 후 예약을 완료해주세요.
                    </p>
                    <p className="text-base font-semibold mt-2">
                      {rooms.find((r) => r.id === selectedRoom)?.roomName} / {selectedDate} /{" "}
                      {startTime.split(":").slice(0, 2).join(":")} ~{" "}
                      {calculateEndTime(startTime, duration)
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense fallback={
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <p>로딩 중...</p>
          </div>
        </main>
      </div>
    }>
      <ReserveContent />
    </Suspense>
  );
}