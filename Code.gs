/**
 * Google Apps Script สำหรับบันทึกการเข้างานสาย (Late Check-in)
 * 
 * วิธีการนำไปใช้สำหรับแผนกบุคคล (HR):
 * 1. สร้าง Google Sheet ใหม่ที่บัญชีของแผนกบุคคล
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. ลบโค้ดเดิมทิ้ง และวางโค้ดทั้งหมดนี้ลงไป
 * 4. กดปุ่ม "บันทึก" (รูปแผ่นดิสก์)
 * 5. กดปุ่ม "การทำให้ใช้งานได้" (Deploy) -> "การทำให้ใช้งานได้รายการใหม่" (New deployment)
 * 6. เลือกประเภท (Select type) เป็น "เว็บแอป" (Web app)
 *    - คำอธิบาย: Checkin API
 *    - ทำงานในฐานะ (Execute as): ฉัน (Me)
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): ทุกคน (Anyone)
 * 7. กด "การทำให้ใช้งานได้" (Deploy)
 * 8. **สำคัญมาก**: คัดลอก "URL ของเว็บแอป" (Web app URL) ที่ได้ ไปใส่ในไฟล์ `script.js` ตรงตัวแปร SCRIPT_URL
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Create headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["วันที่", "เวลา (ห้ามแก้ไข)", "รหัสพนักงาน", "ชื่อ-นามสกุล", "ฝ่าย", "แผนก"]);
    sheet.getRange("A1:F1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  
  try {
    var empId = e.parameter.empId;
    var empName = e.parameter.empName;
    var empDivision = e.parameter.empDivision;
    var empDept = e.parameter.empDept;
    
    // บันทึกเวลาจาก Server จริงๆ เพื่อป้องกันการโกงเวลาจากเครื่องมือถือ
    var timestamp = new Date();
    
    // ตั้งค่า Timezone เป็นเวลาไทย (GMT+7)
    var formattedDate = Utilities.formatDate(timestamp, "GMT+7", "dd/MM/yyyy");
    var formattedTime = Utilities.formatDate(timestamp, "GMT+7", "HH:mm:ss");
    
    // เพิ่มข้อมูลลงในแถวใหม่ของ Google Sheet
    sheet.appendRow([formattedDate, formattedTime, empId, empName, empDivision, empDept]);
    
    // ส่งผลลัพธ์กลับ
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // กรณีเกิดข้อผิดพลาด
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
