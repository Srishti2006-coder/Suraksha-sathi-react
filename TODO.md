# Suraksha Sathi Signup Debug - TODO

## Status: 🔄 In Progress

### [✅] 1. Fix Database Connection
- Edit `backend/db.js` to use `process.env.MONGODB_URI` instead of hardcoded Atlas URL
- Ensure connects to local `mongodb://localhost:27017/suraksha-sathi`

### [✅] 2. Add Debug Logging
- Edit `backend/routes/auth.js` signup route
- Add console.logs for: incoming request, user creation, save success/error

### [ ] 3. Restart Backend Server
```
cd backend
npm start
```
- Verify "MongoDB Connected" logs local connection

### [ ] 4. Test Signup Flow
- React frontend: `npm start`
- Fill signup form → submit
- Check backend console for logs
- MongoDB Compass: Verify new user in local `suraksha-sathi.users` collection

### [ ] 5. Verify Complete Fix
- Multiple signups → no duplicates (email unique)
- Local DB populated, Atlas unchanged
- Frontend shows success modal

---

**Next Step**: Complete step 1 & 2 (edits), then mark as done and proceed.
