import { environment } from '../../../environments/environment';

export class currentUser {
  id?: number;
  name: string = '';
  email: string = '';
  mobile_number: string = '';
  company_name:string = '';
  short_bio:string = '';
  factory_address:string = '';
  office_address:string = '';
  website:string = '';
  expertise:string='';
  group_since:string='';
  business_type:string='';
  state:string='';
  sub_plan_status: boolean = false;
  verified: number = 0;
  password?: string = '';
  confirm_password: string = '';
  gender: string = 'male';
  profileImage?: any = '';
  profileOldImage?: any = '';
  photo: string = '';
  dob: Date = new Date();
  is_active: number = 1;
  role: string = environment.role.userRole;
}
