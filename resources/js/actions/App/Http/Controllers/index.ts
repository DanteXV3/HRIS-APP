import FaceAttendanceController from './FaceAttendanceController'
import DashboardController from './DashboardController'
import DepartmentController from './DepartmentController'
import WorkLocationController from './WorkLocationController'
import WorkingLocationController from './WorkingLocationController'
import PositionController from './PositionController'
import ShiftController from './ShiftController'
import HolidayController from './HolidayController'
import EmployeeController from './EmployeeController'
import PayrollController from './PayrollController'
import AttendanceController from './AttendanceController'
import AttendanceCorrectionController from './AttendanceCorrectionController'
import KpiEvaluationController from './KpiEvaluationController'
import WarningLetterController from './WarningLetterController'
import LeaveRequestController from './LeaveRequestController'
import ExitPermitController from './ExitPermitController'
import OvertimeController from './OvertimeController'
import PaymentRequestController from './PaymentRequestController'
import Settings from './Settings'
const Controllers = {
    FaceAttendanceController: Object.assign(FaceAttendanceController, FaceAttendanceController),
DashboardController: Object.assign(DashboardController, DashboardController),
DepartmentController: Object.assign(DepartmentController, DepartmentController),
WorkLocationController: Object.assign(WorkLocationController, WorkLocationController),
WorkingLocationController: Object.assign(WorkingLocationController, WorkingLocationController),
PositionController: Object.assign(PositionController, PositionController),
ShiftController: Object.assign(ShiftController, ShiftController),
HolidayController: Object.assign(HolidayController, HolidayController),
EmployeeController: Object.assign(EmployeeController, EmployeeController),
PayrollController: Object.assign(PayrollController, PayrollController),
AttendanceController: Object.assign(AttendanceController, AttendanceController),
AttendanceCorrectionController: Object.assign(AttendanceCorrectionController, AttendanceCorrectionController),
KpiEvaluationController: Object.assign(KpiEvaluationController, KpiEvaluationController),
WarningLetterController: Object.assign(WarningLetterController, WarningLetterController),
LeaveRequestController: Object.assign(LeaveRequestController, LeaveRequestController),
ExitPermitController: Object.assign(ExitPermitController, ExitPermitController),
OvertimeController: Object.assign(OvertimeController, OvertimeController),
PaymentRequestController: Object.assign(PaymentRequestController, PaymentRequestController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers