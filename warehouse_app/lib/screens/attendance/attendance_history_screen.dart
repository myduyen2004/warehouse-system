import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/attendance.dart';
import '../../services/attendance_service.dart';
import '../../widgets/loading_indicator.dart';

class AttendanceHistoryScreen extends StatefulWidget {
  final int userId;

  const AttendanceHistoryScreen({
    Key? key,
    required this.userId,
  }) : super(key: key);

  @override
  State<AttendanceHistoryScreen> createState() => _AttendanceHistoryScreenState();
}

class _AttendanceHistoryScreenState extends State<AttendanceHistoryScreen> {
  final AttendanceService _attendanceService = AttendanceService();
  List<Attendance> _attendances = [];
  Map<String, dynamic>? _statistics;
  bool _isLoading = false;
  DateTime _selectedMonth = DateTime.now();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    try {
      final startDate = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
      final endDate = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 0);

      final attendances = await _attendanceService.getUserAttendance(
        userId: widget.userId,
        startDate: startDate,
        endDate: endDate,
      );

      final statistics = await _attendanceService.getStatistics(
        userId: widget.userId,
        month: _selectedMonth.month,
        year: _selectedMonth.year,
      );

      setState(() {
        _attendances = attendances;
        _statistics = statistics;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  void _changeMonth(int delta) {
    setState(() {
      _selectedMonth = DateTime(
        _selectedMonth.year,
        _selectedMonth.month + delta,
      );
    });
    _loadData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lịch sử chấm công'),
      ),
      body: _isLoading
          ? const LoadingIndicator()
          : Column(
              children: [
                _buildMonthSelector(),
                if (_statistics != null) _buildStatistics(),
                Expanded(child: _buildAttendanceList()),
              ],
            ),
    );
  }

  Widget _buildMonthSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.blue[50],
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: () => _changeMonth(-1),
          ),
          Text(
            DateFormat('MMMM yyyy').format(_selectedMonth),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: _selectedMonth.month < DateTime.now().month ||
                    _selectedMonth.year < DateTime.now().year
                ? () => _changeMonth(1)
                : null,
          ),
        ],
      ),
    );
  }

  Widget _buildStatistics() {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Thống kê tháng',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem(
                  'Tổng ngày',
                  '${_statistics!['totalDays'] ?? 0}',
                  Colors.blue,
                ),
                _buildStatItem(
                  'Đi làm',
                  '${_statistics!['presentDays'] ?? 0}',
                  Colors.green,
                ),
                _buildStatItem(
                  'Muộn',
                  '${_statistics!['lateDays'] ?? 0}',
                  Colors.orange,
                ),
              ],
            ),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem(
                  'Tổng giờ',
                  '${(_statistics!['totalWorkingHours'] ?? 0.0).toStringAsFixed(1)}h',
                  Colors.purple,
                ),
                _buildStatItem(
                  'Trung bình',
                  '${(_statistics!['averageWorkingHours'] ?? 0.0).toStringAsFixed(1)}h',
                  Colors.teal,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildAttendanceList() {
    if (_attendances.isEmpty) {
      return const EmptyState(
        message: 'Chưa có dữ liệu chấm công',
        icon: Icons.event_busy,
      );
    }

    return ListView.builder(
      itemCount: _attendances.length,
      padding: const EdgeInsets.all(16),
      itemBuilder: (context, index) {
        final attendance = _attendances[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: _getStatusColor(attendance.status),
              child: Icon(
                _getStatusIcon(attendance.status),
                color: Colors.white,
              ),
            ),
            title: Text(
              DateFormat('dd/MM/yyyy').format(attendance.checkInTime),
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Check-in: ${DateFormat('HH:mm').format(attendance.checkInTime)}',
                ),
                if (attendance.checkOutTime != null)
                  Text(
                    'Check-out: ${DateFormat('HH:mm').format(attendance.checkOutTime!)}',
                  ),
                Text(
                  'Trạng thái: ${attendance.statusDisplay}',
                  style: TextStyle(
                    color: _getStatusColor(attendance.status),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            trailing: attendance.workingHours != null
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '${attendance.workingHours!.toStringAsFixed(1)}h',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Text('Giờ làm'),
                    ],
                  )
                : null,
          ),
        );
      },
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'ON_TIME':
        return Colors.green;
      case 'LATE':
        return Colors.orange;
      case 'EARLY_LEAVE':
        return Colors.blue;
      case 'ABSENT':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'ON_TIME':
        return Icons.check_circle;
      case 'LATE':
        return Icons.access_time;
      case 'EARLY_LEAVE':
        return Icons.logout;
      case 'ABSENT':
        return Icons.cancel;
      default:
        return Icons.help;
    }
  }
}