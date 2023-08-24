<?php

namespace App\Helpers;

use Illuminate\Pagination\LengthAwarePaginator;

class CustomHelpers extends LengthAwarePaginator
{
    public function previousPageUrl()
    {
        return $this->currentPage() > 1
            ? $this->url($this->currentPage() - 1)
            : 'Prec';
    }

    public function nextPageUrl()
    {
        return $this->currentPage() < $this->lastPage()
            ? $this->url($this->currentPage() + 1)
            : 'Suivant';
    }
}
