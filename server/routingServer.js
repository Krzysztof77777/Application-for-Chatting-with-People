import {
    HomePageRoute
} from "../routes/homepage.js";
import {
    RegisterRoute
} from '../routes/register.js';
import {
    VerifyRoute
} from "../routes/verify.js";
import {
    ResetPasswordRoute
} from "../routes/resetpassword.js";
import {
    LoginRoute
} from "../routes/login.js";
import {
    ChangePasswordRoute
} from "../routes/changepassword.js";

const startRouting = (app) => {
    app.use('/', HomePageRoute);
    app.use('/registration', RegisterRoute);
    app.use('/registration/verify', VerifyRoute);
    app.use('/reset/password', ResetPasswordRoute)
    app.use('/login', LoginRoute);
    app.use('/account/change/password', ChangePasswordRoute)
}

export default startRouting;