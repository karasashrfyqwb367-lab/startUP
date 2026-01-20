import { connect } from "mongoose";
const connectinDB = async () => {
    try {
        await connect(process.env.DB_URI);
        console.log("conneced susseccfull DB");
    }
    catch (error) {
        console.log("fail to connection DB");
    }
};
export default connectinDB;
