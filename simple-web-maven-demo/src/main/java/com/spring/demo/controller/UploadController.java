package com.spring.demo.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Controller
@RequestMapping(value = "uploadfile")
public class UploadController {

	public static String FOLDER_PATH = "D:\\me\\upwork\\extjs_work\\output\\";

	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody
	String handleFileUpload(
			@RequestParam("file_path_field") CommonsMultipartFile uploadItem) throws IOException {
		JsonObject finalJson = new JsonObject(); 
		if (uploadItem != null && !uploadItem.isEmpty()) {
			String name = uploadItem.getOriginalFilename();
			BufferedOutputStream bos = null;
			FileOutputStream fos = null;
			try {
				File file = new File(FOLDER_PATH + name);
				byte[] bytes = uploadItem.getBytes();
				fos = new FileOutputStream(file);
				bos = new BufferedOutputStream(fos);
				bos.write(bytes);
				System.out.println("You successfully uploaded " + name + "!");
				bos.close();
				fos.close();
				finalJson.addProperty("success", true);
				finalJson.add("data", processExcel(file));
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println("You failed to upload " + name + " => "
						+ e.getMessage());
				finalJson.addProperty("success", false);
			} finally {
//				fos.close();
			}
		} else {
			System.out.println("Failed to upload because the file was empty.");
			finalJson.addProperty("success", false);
		}
		return finalJson.toString();
	}

	private JsonArray processExcel(File file) throws Exception {
		JsonObject jsonRow = null; 
		JsonArray jsonRows = new JsonArray();
		XSSFWorkbook workbook = null;
		FileInputStream fis = null;
		String column = "column";
		try {
			fis = new FileInputStream(file);

			// Create Workbook instance holding reference to .xlsx file
			workbook = new XSSFWorkbook(fis);

			// Get first/desired sheet from the workbook
			XSSFSheet sheet = workbook.getSheetAt(0);

			// Iterate through each rows one by one
			Iterator<Row> rowIterator = sheet.iterator();
			int index = 0;
			while (rowIterator.hasNext()) {
				index = 0;
				jsonRow = new JsonObject();
				Row row = rowIterator.next();
				// For each row, iterate through all the columns
				Iterator<Cell> cellIterator = row.cellIterator();

				while (cellIterator.hasNext()) {
					
					Cell cell = cellIterator.next();
					// Check the cell type and format accordingly
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_NUMERIC:
						jsonRow.addProperty(column + "_" + index++, cell.getNumericCellValue());
//						System.out.print(column + "_" + index+++"::"+ cell.getNumericCellValue()+"\t");
						break;
					case Cell.CELL_TYPE_STRING:
						jsonRow.addProperty(column + "_" + index++, cell.getStringCellValue());
//						System.out.print(column + "_" + index+++"::"+ cell.getStringCellValue()+"\t");
						break;
					default:
						System.err
								.println(cell.getCellType()
										+ " content type not supported by system as of now.");

					}
				}
				jsonRows.add(jsonRow);
				System.out.println();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		finally{
			workbook.close();
			fis.close();
		}
		return jsonRows;
	}
}
