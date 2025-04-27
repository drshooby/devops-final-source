def calculate_next_milestone(current_count: int) -> int:
    if current_count < 1:
        return 1
    elif current_count < 5:
        return 5
    elif current_count < 12:
        return 12
    elif current_count < 24:
        return 24
    elif current_count < 40:
        return 40
    else:
        return ((current_count // 10) + 1) * 10