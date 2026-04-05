# test_hvi.py
from health_index_score import compute_hvi_for_zips, get_top_hvi

def main():
    test_zips = ["93706", "90043", "92612"]
    print("Testing specific ZIPs:")
    print(compute_hvi_for_zips(test_zips))

    print("\nTop 5 most vulnerable ZIPs:")
    print(get_top_hvi(5))

if __name__ == "__main__":
    main()