export const ADMIN_ROLES = { ADMIN: 'admin', SUB_ADMIN: 'sub_admin', USER: 'user' }
export const ADMIN_STATES = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', BLOCKED: 'blocked', DELETED: 'deleted' }
export const MODULES_STATES = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', BLOCKED: 'blocked' }
export const PERMISSION_STATES = { ACTIVE: 'active', INACTIVE: 'inactive' }
export const POLICY_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }
export const SECURITY_TYPES = {
    ACTIVATION_MAIL: 'activation_mail',
    VERIFICATION_MAIL: 'verification_mail',
    VERIFICATION_PHONE: 'verification_phone',
    AUTH_PHONE_VERIFICATION: 'auth_phone_verification',
    UPDATE_MAIL_VERIFICATION: 'update_mail_verification',
    UPDATE_PHONE_VERIFICATION: 'update_phone_verification',
    ACCOUNT_DELETION: 'account_deletion',
}
export const SECURITY_MODES = { EMAIL: 'email', SMS: 'sms' }
export const EMAIL_CATEGORIES = { ADMIN_ACTIVATION_LINK: 'ADMIN_ACTIVATION_LINK', VERIFICATION_MAIL: 'verification_mail' }
export const PHONE_CATEGORIES = { PHONE_VERIFICATION: 'phone_verification' }
export const EMAIL_TEMPLATE_STATUS = { ACTIVE: 'active', INACTIVE: 'inactive' }
export const GENDER = { MALE: 'male', FEMALE: 'female', OTHER: 'other' }
export const ADDRESS_TYPE = { HOME: 'home', OFFICE: 'office', OTHER: 'other' }
export const AWS_FILE_TYPES = { SINGLE: 'single', MULTI: 'multi', FIELDS: 'field' }
