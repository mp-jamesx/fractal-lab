#!/usr/bin/env python3
"""Compatibility launcher for the built local gallery, including image saving."""
import argparse
import subprocess
from pathlib import Path

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    try:
        subprocess.run(['npm', 'run', 'preview', '--', '--port', str(args.port)], cwd=Path(__file__).resolve().parent, check=True)
    except KeyboardInterrupt:
        pass
