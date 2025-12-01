class Validators {
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email không được để trống';
    }
    
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Email không hợp lệ';
    }
    
    return null;
  }

  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Tên đăng nhập không được để trống';
    }
    
    if (value.length < 3) {
      return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    
    if (value.length > 20) {
      return 'Tên đăng nhập không được quá 20 ký tự';
    }
    
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Mật khẩu không được để trống';
    }
    
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    return null;
  }

  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName không được để trống';
    }
    return null;
  }

  static String? validateNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Giá trị không được để trống';
    }
    
    if (double.tryParse(value) == null) {
      return 'Giá trị phải là số';
    }
    
    return null;
  }

  static String? validatePositiveNumber(String? value) {
    final numberValidation = validateNumber(value);
    if (numberValidation != null) {
      return numberValidation;
    }
    
    if (double.parse(value!) < 0) {
      return 'Giá trị phải lớn hơn 0';
    }
    
    return null;
  }

  static String? validateInteger(String? value) {
    if (value == null || value.isEmpty) {
      return 'Giá trị không được để trống';
    }
    
    if (int.tryParse(value) == null) {
      return 'Giá trị phải là số nguyên';
    }
    
    return null;
  }

  static String? validatePositiveInteger(String? value) {
    final intValidation = validateInteger(value);
    if (intValidation != null) {
      return intValidation;
    }
    
    if (int.parse(value!) < 0) {
      return 'Giá trị phải lớn hơn hoặc bằng 0';
    }
    
    return null;
  }
}