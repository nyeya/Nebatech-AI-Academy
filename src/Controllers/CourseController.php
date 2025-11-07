<?php

namespace Nebatech\Controllers;

use Nebatech\Core\Controller;

class CourseController extends Controller
{
    /**
     * Show all courses
     */
    public function index()
    {
        echo $this->view('courses/index');
    }

    /**
     * Show Frontend Development courses
     */
    public function frontend()
    {
        echo $this->view('courses/frontend');
    }

    /**
     * Show Backend Development courses
     */
    public function backend()
    {
        echo $this->view('courses/backend');
    }

    /**
     * Show Full Stack courses
     */
    public function fullstack()
    {
        echo $this->view('courses/fullstack');
    }

    /**
     * Show Mobile Development courses
     */
    public function mobile()
    {
        echo $this->view('courses/mobile');
    }

    /**
     * Show AI & Machine Learning courses
     */
    public function ai()
    {
        echo $this->view('courses/ai');
    }

    /**
     * Show Data Science courses
     */
    public function dataScience()
    {
        echo $this->view('courses/data-science');
    }

    /**
     * Show Cybersecurity courses
     */
    public function cybersecurity()
    {
        echo $this->view('courses/cybersecurity');
    }

    /**
     * Show Cloud Computing courses
     */
    public function cloud()
    {
        echo $this->view('courses/cloud');
    }

    /**
     * Show individual course details
     */
    public function show($slug)
    {
        echo $this->view('courses/show', ['slug' => $slug]);
    }
}
