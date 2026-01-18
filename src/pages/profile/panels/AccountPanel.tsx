import {type ChangeEvent, useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from 'react-bootstrap';
import {BsPersonCircle} from 'react-icons/bs';
import {FcGoogle} from 'react-icons/fc';
import {toast} from "react-toastify";
import {type SubmitHandler, useForm} from "react-hook-form";

import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {getCurrentUser} from '@/store/user/user.selectors';
import {linkGoogleAction, unlinkAccountAction, updateUserProfileAction} from "@/store/user/user.actions.ts";

import {uploadImageToCloudinary} from "@/services/vendor/cloudinary";

import SectionTitle from '../components/SectionTitle';
import type {UpdateUserRequest} from '@/types/user.types.ts';
import {registerDisplayNameRules} from "@/utils/formValidation";

interface AccountPanelProps {
    onSaveSuccess: () => void;
}

function AccountPanel({onSaveSuccess}: AccountPanelProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getCurrentUser);
    const [isCopied, setIsCopied] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Form hook để quản lý trạng thái form cập nhật thông tin
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {errors, isSubmitting}
    } = useForm<UpdateUserRequest>({
        mode: "onTouched"
    });

    // Theo dõi giá trị để hiển thị preview avatar và radio giới tính
    const avatarValue = watch('avatar');
    const genderValue = watch('gender');

    // Cập nhật giá trị form khi user thay đổi (load lần đầu hoặc update thành công)
    useEffect(() => {
        if (user) {
            reset({
                displayName: user.displayName || '',
                gender: user.gender,
                avatar: user.avatar || ''
            });
            setSelectedFile(null);
        }
    }, [user, reset]);

    if (!user) return null;

    /**
     * Xử lý sao chép ID người dùng vào clipboard
     */
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(user.id);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    /**
     * Gửi yêu cầu cập nhật thông tin người dùng (Avatar, Tên, Giới tính)
     */
    const onSubmit: SubmitHandler<UpdateUserRequest> = async (data) => {
        try {
            let avatarUrl = data.avatar;

            // Nếu có chọn file ảnh mới -> Upload lên Cloudinary trước
            if (selectedFile) {
                const toastId = toast.loading("Đang tải ảnh lên...");
                try {
                    avatarUrl = await uploadImageToCloudinary(selectedFile);
                    toast.dismiss(toastId);
                } catch (e) {
                    toast.dismiss(toastId);
                    throw e;
                }
            }

            await dispatch(updateUserProfileAction({...data, avatar: avatarUrl})).unwrap();
            toast.success("Cập nhật thông tin thành công!");
            setSelectedFile(null);
            onSaveSuccess();
        } catch (error) {
            toast.error("Cập nhật thất bại: " + String(error));
        }
    };

    /**
     * Kiểm tra xem tài khoản đã được liên kết với Google chưa
     * @param providerId 'google.com'
     */
    const isLinked = (providerId: string) => {
        return user.providers?.some(p => p.providerId === providerId) ?? false;
    };

    /**
     * Xử lý bật/tắt liên kết mạng xã hội
     */
    const handleToggleSocial = async (providerId: 'google.com') => {
        const linked = isLinked(providerId);
        try {
            if (linked) {
                // Nếu đã liên kết -> Hủy liên kết
                if (user.providers.length <= 1 && !user.providers.some(p => p.providerId === 'password')) {
                    toast.warning("Bạn cần thiết lập mật khẩu hoặc liên kết tài khoản khác trước khi hủy liên kết này.");
                    return;
                }

                await dispatch(unlinkAccountAction(providerId)).unwrap();
                toast.success(`Đã hủy liên kết Google`);
            } else {
                // Nếu chưa liên kết -> Thực hiện liên kết
                await dispatch(linkGoogleAction()).unwrap();
                toast.success(`Đã liên kết Google thành công`);
            }
        } catch (error) {
            toast.error(`Thao tác thất bại: ${String(error)}`);
        }
    };

    // Component phụ hiển thị Label cột bên trái
    const LabelCol = ({children}: { children: React.ReactNode }) => (
        <Col sm={3} className="text-secondary fw-medium small">
            {children}
        </Col>
    );

    return (
        <div className="d-flex flex-column gap-4">
            <Card className="border-0 shadow-sm p-4">
                <SectionTitle text="Thông tin tài khoản"/>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Ảnh đại diện */}
                    <Row className="mb-4 align-items-center">
                        <LabelCol>Ảnh đại diện:</LabelCol>
                        <Col sm={9}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="profile-avatar" style={{width: '48px', height: '48px'}}>
                                    {avatarValue ? (
                                        <img src={avatarValue} alt="avatar"
                                             className="w-100 h-100 rounded-circle object-fit-cover"/>
                                    ) : (
                                        <BsPersonCircle size={48} className="text-secondary bg-light rounded-circle"/>
                                    )}
                                </div>
                                <Form.Label
                                    className="mb-0 text-secondary text-decoration-underline small cursor-pointer hover-text-primary">
                                    Thay đổi
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        className="d-none"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setSelectedFile(file);
                                            const url = URL.createObjectURL(file);
                                            setValue('avatar', url, {shouldDirty: true});
                                        }}
                                    />
                                </Form.Label>
                            </div>
                        </Col>
                    </Row>


                    {/* ID Tài khoản */}
                    <Row className="mb-4 align-items-center">
                        <LabelCol>ID tài khoản:</LabelCol>
                        <Col sm={9} className="d-flex align-items-center justify-content-between">
                            <span className="text-dark small">{user.id}</span>
                            <span
                                className={`text-decoration-underline small cursor-pointer hover-text-primary ${isCopied ? 'text-success fw-bold' : 'text-secondary'}`}
                                onClick={handleCopy}
                            >
                                {isCopied ? 'Đã sao chép' : 'Sao chép'}
                            </span>
                        </Col>
                    </Row>

                    {/* Tên hiển thị */}
                    <Row className="mb-4 align-items-center">
                        <LabelCol>Tên hiển thị:</LabelCol>
                        <Col sm={9}>
                            <Form.Control
                                type="text"
                                isInvalid={!!errors.displayName}
                                {...register("displayName", registerDisplayNameRules as any)}
                                className="bg-light-subtle"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.displayName?.message}
                            </Form.Control.Feedback>
                        </Col>
                    </Row>

                    {/* Giới tính */}
                    <Row className="mb-4 align-items-center">
                        <LabelCol>Giới tính:</LabelCol>
                        <Col sm={9}>
                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="radio"
                                    id="gender-male"
                                    label="Nam"
                                    value="male"
                                    {...register("gender")}
                                    checked={genderValue === 'male'}
                                />
                                <Form.Check
                                    type="radio"
                                    id="gender-female"
                                    label="Nữ"
                                    value="female"
                                    {...register("gender")}
                                    checked={genderValue === 'female'}
                                />
                                <Form.Check
                                    type="radio"
                                    id="gender-other"
                                    label="Khác"
                                    value="other"
                                    {...register("gender")}
                                    checked={genderValue === 'other' || !genderValue}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Email (Readonly) */}
                    <Row className="mb-4 align-items-center">
                        <LabelCol>Email:</LabelCol>
                        <Col sm={9}>
                            <Form.Control
                                value={user.emailOrPhone}
                                disabled
                                className="bg-light"
                            />
                        </Col>
                    </Row>

                    {/* Nút lưu thay đổi */}
                    <div className="d-flex justify-content-end">
                        <Button
                            className="bg-nld-blue border-0 px-4 py-2"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </Form>
            </Card>

            <Card className="border-0 shadow-sm p-4">
                <SectionTitle text="Liên kết mạng xã hội"/>

                <div className="d-flex flex-column gap-3">
                    {/* Google */}
                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-2 bg-white">
                        <div className="d-flex align-items-center gap-3">
                            <FcGoogle size={24}/>
                            <span className="fw-medium text-dark">Tài khoản Google</span>
                        </div>
                        <Form.Check
                            type="switch"
                            id="link-google"
                            checked={isLinked('google.com')}
                            onChange={() => handleToggleSocial('google.com')}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default AccountPanel;
