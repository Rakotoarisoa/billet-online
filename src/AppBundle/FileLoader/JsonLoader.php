<?php
namespace AppBundle\FileLoader;

use Symfony\Component\Config\Loader\FileLoader;
use Symfony\Component\Yaml\Yaml;

class JsonLoader extends FileLoader
{
    public function load($resource, $type = null)
    {
        $configValues = json_decode(file_get_contents($resource));

        return $configValues;
    }

    public function supports($resource, $type = null)
    {
        return is_string($resource) && 'json' === pathinfo(
                $resource,
                PATHINFO_EXTENSION
            );
    }
}