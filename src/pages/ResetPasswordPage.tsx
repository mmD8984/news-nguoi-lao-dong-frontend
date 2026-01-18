import {useEffect, useMemo, useState} from "react";
import {Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {type SubmitHandler, useForm} from "react-hook-form";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {BsEye, BsEyeSlash} from "react-icons/bs";

import {useAppDispatch} from "@/store/hooks";
import {confirmResetPassword, verifyResetPasswordCode,} from "@/store/user/user.actions";
import {confirmPasswordRequiredMessage, resetNewPasswordRules, validateConfirmPassword,} from "@/utils/formValidation";
import type {ResetPasswordFormData} from "@/types/user.types.ts";

function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Lấy oobCode từ URL params
    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );
    const oobCode = params.get("oobCode") || "";

    const [email, setEmail] = useState<string>("");
    const [isVerifying, setIsVerifying] = useState<boolean>(true);
    const [verifyError, setVerifyError] = useState<string>("");
    const [completed, setCompleted] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        getValues,
        watch,
    } = useForm<ResetPasswordFormData>({mode: "onTouched"});

    const newPasswordValue = watch("newPassword");
    const confirmPasswordValue = watch("confirmPassword");

    useEffect(() => {
        let isMounted = true;

        async function verify() {
            if (!oobCode) {
                setVerifyError("Đường dẫn đặt lại mật khẩu không hợp lệ.");
                setIsVerifying(false);
                return;
            }
            try {
                const verifiedEmail = await dispatch(
                    verifyResetPasswordCode({oobCode})
                ).unwrap();
                if (!isMounted) return;
                setEmail(verifiedEmail);
                setVerifyError("");
            } catch (err) {
                if (!isMounted) return;
                setVerifyError(
                    typeof err === "string" ? err : "Token không hợp lệ hoặc đã hết hạn."
                );
            } finally {
                if (isMounted) setIsVerifying(false);
            }
        }

        verify();
        return () => {
            isMounted = false;
        };
    }, [dispatch, oobCode]);

    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        if (!oobCode) {
            toast.error("Đường dẫn đặt lại mật khẩu không hợp lệ.");
            return;
        }
        try {
            await dispatch(
                confirmResetPassword({
                    oobCode,
                    newPassword: data.newPassword,
                })
            ).unwrap();
            toast.success("Cập nhật mật khẩu thành công.");
            setCompleted(true);
        } catch (err) {
            toast.error(String(err));
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6} xl={5}>
                    {/* Đang xác minh mã */}
                    {isVerifying ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <Spinner animation="border" role="status"/>
                        </div>
                    ) : verifyError ? (
                        // Lỗi xác minh
                        <div className="text-center">
                            <p className="text-danger mb-3">{verifyError}</p>
                            <Button variant="primary" onClick={() => navigate("/login")}>
                                Quay lại đăng nhập
                            </Button>
                        </div>
                    ) : completed ? (
                        // Thành công
                        <div className="text-center py-5">
                            <h4 className="fw-bold mb-3">Xác nhận cài đặt lại mật khẩu</h4>
                            <p className="text-muted">
                                Mật khẩu của bạn đã được cài đặt lại.{" "}
                                <Link to="/login" className="text-decoration-underline">
                                    Click vào đây để đăng nhập.
                                </Link>
                            </p>
                        </div>
                    ) : (
                        // Form đặt lại mật khẩu
                        <>
                            <h5 className="fw-bold text-center mb-4">Cài đặt lại mật khẩu</h5>
                            <Form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
                                {/* Email (readonly) */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small">Email</Form.Label>
                                    <Form.Control
                                        value={email}
                                        disabled
                                        readOnly
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold small">
                                        Mật khẩu mới
                                    </Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu mới"
                                            isInvalid={!!errors.newPassword}
                                            {...register("newPassword", resetNewPasswordRules)}
                                            className="py-2 pe-5"
                                        />
                                        {newPasswordValue && (
                                            <Button
                                                variant="link"
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() => setShowNewPassword((v) => !v)}
                                                aria-label={
                                                    showNewPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                                                }
                                                className="position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                                            >
                                                {showNewPassword ? (
                                                    <BsEyeSlash size={18}/>
                                                ) : (
                                                    <BsEye size={18}/>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    {errors.newPassword?.message && (
                                        <div className="invalid-feedback d-block">
                                            {errors.newPassword.message}
                                        </div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold small">
                                        Xác nhận mật khẩu
                                    </Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Nhập lại mật khẩu"
                                            isInvalid={!!errors.confirmPassword}
                                            {...register("confirmPassword", {
                                                required: confirmPasswordRequiredMessage,
                                                validate: (value) =>
                                                    validateConfirmPassword(
                                                        value,
                                                        getValues("newPassword")
                                                    ),
                                            })}
                                            className="py-2 pe-5"
                                        />
                                        {confirmPasswordValue && (
                                            <Button
                                                variant="link"
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Ẩn mật khẩu"
                                                        : "Hiển thị mật khẩu"
                                                }
                                                className="position-absolute end-0 top-50 translate-middle-y text-muted px-3"
                                            >
                                                {showConfirmPassword ? (
                                                    <BsEyeSlash size={18}/>
                                                ) : (
                                                    <BsEye size={18}/>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    {errors.confirmPassword?.message && (
                                        <div className="invalid-feedback d-block">
                                            {errors.confirmPassword.message}
                                        </div>
                                    )}
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 bg-nld-auth border-0 py-2 fw-bold"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang xử lý..." : "Hoàn tất"}
                                </Button>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ResetPasswordPage;
