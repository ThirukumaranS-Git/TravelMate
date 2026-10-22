import express from 'express';
import dotenv from 'dotenv';
dotenv.config({path:'../.env'});
const app=express(); app.use(express.json());
const port=Number(process.env.EXPRESS_PORT||5000);
app.get('/api/health',(req,res)=>res.json({status:'ok',service:'TravelMate Express'}));
app.get('/api/weather',(req,res)=>{if(!process.env.WEATHER_API_KEY)return res.status(503).json({configured:false,message:'Weather API key not configured. Add WEATHER_API_KEY to .env.'});res.json({configured:true,message:'Provider key is configured. Add provider-specific request code here.'});});
app.listen(port,()=>console.log(`TravelMate Express listening on ${port}`));
