import pytest
from generator import format_readme

def test_format_readme_standard():
    """Test with standard inputs."""
    name = "Test Project"
    desc = "A project for testing"
    inst = "pip install test"
    usage = "import test"

    result = format_readme(name, desc, inst, usage)

    assert f"# {name}" in result
    assert f"## Description\n{desc}" in result
    assert inst in result
    assert usage in result

def test_format_readme_empty_inputs():
    """Test with empty strings to ensure it doesn't crash."""
    result = format_readme("", "", "", "")

    assert "# " in result
    assert "## Description" in result
    assert "```bash\n\n```" in result

def test_format_readme_special_chars():
    """Test with special characters in inputs."""
    name = "Project & Symbols"
    desc = "Testing $pecial #chars!"
    inst = "install -r requirements.txt"
    usage = "print('hello')"

    result = format_readme(name, desc, inst, usage)

    assert name in result
    assert desc in result
    assert inst in result
    assert usage in result
