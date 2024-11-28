import { Report } from "../models/itemModel.js";
import { User } from "../models/userModel.js";


export const report=async (req,res)=>{
    try {

        const userId = req.user.userId;
        const {itemType,category,contact,location,specification,foundOn,reportStatus}= req.body;
        if(!userId){
            return res.status(404).send({
                message: 'User not found'
            })
        }
        if(!itemType||!category ||!contact ||!location ||!specification||!foundOn ||!reportStatus){
           
                return res.status(404).json({message: 'some missing value',
                    success: false
                });
            
        }
        const toSave={
            itemType:itemType,category:category,location:location,specification:specification,
            foundOn:foundOn,reportStatus:reportStatus,reportedBy:userId,contact:contact
        }

        const createdItem = await Report.create(toSave)
        const user = await User.findById(userId);

        user.reports.push(createdItem._id);
        console.log(user)
        await user.save();
        if(!createdItem){
            return res.status(404).json({message: 'Error creating',
                success: false
            });
        }
        return res.status(200).json({reports:createdItem,
            success: true
        });
        
    } catch (error) {
        console.log(error)
    }
}


export const allReports = async(req, res) => {
            try {
                const report = await Report.find().populate({
                    path:'reportedBy'
                });
                return res.status(200).json({
                    reports:report,
                    success:true
                })
            } catch (error) {
                console.log(error)
            }
}

